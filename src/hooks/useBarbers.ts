import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Barber } from "@/components/barberos/BarberCard";

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBarbers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching barbers:", error);
        toast.error("Error al cargar los barberos");
        return;
      }

      const transformed: Barber[] = (data || []).map((b) => ({
        id: b.id,
        name: b.full_name,
        email: b.email || "",
        phone: b.phone || "",
        dni: b.dni || "",
        status: b.active ? "active" : "inactive",
        specialty: b.specialty || "Mixto",
        hireDate: b.hire_date || b.created_at?.split("T")[0],
        photoUrl: b.photo_url,
        services: [],
        rating: 4.5,
        reviewCount: 0,
        totalCuts: 0,
        revenue: 0,
        commissionPercentage: b.commission_percentage ?? undefined,
        lunchIncluded: b.lunch_included ?? undefined,
        lunchAmount: b.lunch_amount ? Number(b.lunch_amount) : undefined,
        incentivesEnabled: b.incentives_enabled ?? undefined,
        incentivePerCut: b.incentive_per_cut ? Number(b.incentive_per_cut) : undefined,
        incentiveThreshold: b.incentive_threshold ?? undefined,
      }));

      // Enrich with real stats from haircuts
      const { data: haircutStats } = await supabase
        .from("income_by_barber")
        .select("*");

      if (haircutStats) {
        for (const barber of transformed) {
          const stats = haircutStats.find((s) => s.barber_id === barber.id);
          if (stats) {
            barber.totalCuts = Number(stats.total_sales) || 0;
            barber.revenue = Number(stats.total_revenue) || 0;
          }
        }
      }

      setBarbers(transformed);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado al cargar");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const toggleStatus = async (barber: Barber) => {
    const newActive = barber.status !== "active";
    const { error } = await supabase
      .from("barbers")
      .update({ active: newActive })
      .eq("id", barber.id);

    if (error) {
      toast.error("Error al cambiar estado");
      return;
    }
    toast.success(`${barber.name} ahora está ${newActive ? "activo" : "inactivo"}`);
    fetchBarbers();
  };

  const updateBarber = async (id: string, updates: Record<string, any>) => {
    const { error } = await supabase.from("barbers").update(updates).eq("id", id);
    if (error) {
      toast.error("Error al actualizar barbero");
      return false;
    }
    toast.success("Barbero actualizado");
    fetchBarbers();
    return true;
  };

  const deleteBarber = async (id: string) => {
    const { error } = await supabase.from("barbers").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar barbero");
      return false;
    }
    toast.success("Barbero eliminado");
    fetchBarbers();
    return true;
  };

  return { barbers, isLoading, fetchBarbers, toggleStatus, updateBarber, deleteBarber };
}

// Schedule hooks
export function useBarberSchedules() {
  const [schedules, setSchedules] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("barber_schedules")
      .select("*")
      .order("day_of_week");

    if (error) {
      console.error("Error fetching schedules:", error);
      setIsLoading(false);
      return;
    }

    const grouped: Record<string, any[]> = {};
    for (const s of data || []) {
      if (!grouped[s.barber_id]) grouped[s.barber_id] = [];
      grouped[s.barber_id].push(s);
    }
    setSchedules(grouped);
    setIsLoading(false);
  }, []);

  const saveSchedule = async (barberId: string, dayOfWeek: number, startTime: string, endTime: string) => {
    // Upsert: delete existing then insert
    await supabase
      .from("barber_schedules")
      .delete()
      .eq("barber_id", barberId)
      .eq("day_of_week", dayOfWeek);

    const { error } = await supabase.from("barber_schedules").insert({
      barber_id: barberId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    });

    if (error) {
      toast.error("Error al guardar horario");
      return false;
    }
    fetchSchedules();
    return true;
  };

  const saveBulkSchedule = async (barberId: string, days: number[], startTime: string, endTime: string) => {
    // Delete existing for those days
    for (const day of days) {
      await supabase
        .from("barber_schedules")
        .delete()
        .eq("barber_id", barberId)
        .eq("day_of_week", day);
    }

    const rows = days.map((day) => ({
      barber_id: barberId,
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
    }));

    const { error } = await supabase.from("barber_schedules").insert(rows);
    if (error) {
      toast.error("Error al guardar horarios");
      return false;
    }
    toast.success("Horarios actualizados");
    fetchSchedules();
    return true;
  };

  const deleteSchedule = async (barberId: string, dayOfWeek: number) => {
    await supabase
      .from("barber_schedules")
      .delete()
      .eq("barber_id", barberId)
      .eq("day_of_week", dayOfWeek);
    fetchSchedules();
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, isLoading, fetchSchedules, saveSchedule, saveBulkSchedule, deleteSchedule };
}

// Attendance hooks
export function useBarberAttendance() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendance = useCallback(async (date?: string) => {
    setIsLoading(true);
    let query = supabase
      .from("barber_attendance")
      .select("*, barbers(full_name, photo_url)")
      .order("created_at", { ascending: false });

    if (date) {
      query = query.eq("attendance_date", date);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching attendance:", error);
      setIsLoading(false);
      return;
    }
    setAttendance(data || []);
    setIsLoading(false);
  }, []);

  const fetchMonthlyAttendance = useCallback(async (barberId: string, year: number, month: number) => {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("barber_attendance")
      .select("*")
      .eq("barber_id", barberId)
      .gte("attendance_date", startDate)
      .lte("attendance_date", endDate)
      .order("attendance_date");

    if (error) {
      console.error("Error:", error);
      return [];
    }
    return data || [];
  }, []);

  const markEntry = async (barberId: string, date: string, scheduledStart?: string, scheduledEnd?: string) => {
    const now = new Date();
    const entryTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    // Determine if late
    let status: "present" | "late" = "present";
    if (scheduledStart && entryTime > scheduledStart) {
      status = "late";
    }

    const { error } = await supabase.from("barber_attendance").upsert(
      {
        barber_id: barberId,
        attendance_date: date,
        entry_time: entryTime,
        scheduled_start: scheduledStart || null,
        scheduled_end: scheduledEnd || null,
        status,
      },
      { onConflict: "barber_id,attendance_date" }
    );

    if (error) {
      toast.error("Error al registrar entrada");
      return false;
    }
    toast.success(`Entrada registrada a las ${entryTime}`);
    return true;
  };

  const markExit = async (barberId: string, date: string) => {
    const now = new Date();
    const exitTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const { error } = await supabase
      .from("barber_attendance")
      .update({ exit_time: exitTime })
      .eq("barber_id", barberId)
      .eq("attendance_date", date);

    if (error) {
      toast.error("Error al registrar salida");
      return false;
    }
    toast.success(`Salida registrada a las ${exitTime}`);
    return true;
  };

  const markAbsent = async (barberId: string, date: string, notes?: string) => {
    const { error } = await supabase.from("barber_attendance").upsert(
      {
        barber_id: barberId,
        attendance_date: date,
        status: "absent",
        notes,
      },
      { onConflict: "barber_id,attendance_date" }
    );
    if (error) {
      toast.error("Error al registrar ausencia");
      return false;
    }
    toast.success("Ausencia registrada");
    return true;
  };

  const updateAttendanceNotes = async (id: string, notes: string) => {
    const { error } = await supabase
      .from("barber_attendance")
      .update({ notes })
      .eq("id", id);
    if (error) toast.error("Error al guardar nota");
  };

  return { attendance, isLoading, fetchAttendance, fetchMonthlyAttendance, markEntry, markExit, markAbsent, updateAttendanceNotes };
}

// Chair rentals hooks
export function useChairRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRentals = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("chair_rentals")
      .select("*, barbers(full_name, photo_url)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error:", error);
      setIsLoading(false);
      return;
    }
    setRentals(data || []);
    setIsLoading(false);
  }, []);

  const fetchPayments = useCallback(async (rentalId?: string) => {
    let query = supabase
      .from("chair_rental_payments")
      .select("*, chair_rentals(barber_id, chair_number, barbers(full_name))")
      .order("payment_date", { ascending: false });

    if (rentalId) query = query.eq("rental_id", rentalId);
    const { data } = await query;
    setPayments(data || []);
  }, []);

  const createRental = async (rental: {
    barber_id: string;
    chair_number: number;
    weekly_rate: number;
    start_date: string;
    end_date?: string;
    contract_notes?: string;
    payment_day?: string;
    deposit_amount?: number;
  }) => {
    const { error } = await supabase.from("chair_rentals").insert(rental);
    if (error) {
      toast.error("Error al crear contrato: " + error.message);
      return false;
    }
    toast.success("Contrato de alquiler creado");
    fetchRentals();
    return true;
  };

  const registerPayment = async (payment: {
    rental_id: string;
    amount: number;
    week_start: string;
    week_end: string;
    payment_method?: string;
    notes?: string;
  }) => {
    const { error } = await supabase.from("chair_rental_payments").insert(payment);
    if (error) {
      toast.error("Error al registrar pago");
      return false;
    }
    toast.success("Pago registrado");
    fetchPayments();
    return true;
  };

  const cancelRental = async (id: string) => {
    const { error } = await supabase
      .from("chair_rentals")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast.error("Error al cancelar contrato");
      return false;
    }
    toast.success("Contrato cancelado");
    fetchRentals();
    return true;
  };

  useEffect(() => {
    fetchRentals();
    fetchPayments();
  }, [fetchRentals, fetchPayments]);

  return { rentals, payments, isLoading, fetchRentals, fetchPayments, createRental, registerPayment, cancelRental };
}
