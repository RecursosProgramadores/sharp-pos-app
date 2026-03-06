import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface RealtimeNotification {
  id: string;
  title: string;
  body: string;
  time: Date;
  unread: boolean;
  type: "reservation" | "stock" | "sale";
}

// Request browser notification permission
export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function showBrowserNotification(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "new-reservation",
    } as NotificationOptions);
  }
}

export function useRealtimeNotifications(
  onNewNotification: (notification: RealtimeNotification) => void
) {
  const queryClient = useQueryClient();
  const callbackRef = useRef(onNewNotification);
  callbackRef.current = onNewNotification;

  useEffect(() => {
    const channel = supabase
      .channel("reservations-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reservations",
        },
        (payload) => {
          const newRes = payload.new as any;
          const title = "🗓️ Nueva Reserva";
          const body = `${newRes.client_name} — ${newRes.reservation_date} a las ${newRes.reservation_time?.slice(0, 5)}`;

          // Browser push notification
          showBrowserNotification(title, body);

          // Sonner toast
          toast.info(title, { description: body, duration: 8000 });

          // Add to in-app notifications
          callbackRef.current({
            id: newRes.id,
            title,
            body,
            time: new Date(),
            unread: true,
            type: "reservation",
          });

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["reservations"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-today-reservations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
