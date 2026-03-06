/**
 * WhatsApp messaging utilities using wa.me deep links.
 * These open WhatsApp with pre-filled messages — no API key required.
 */

function cleanPhone(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");
  // If starts with 0, assume local Peru number, replace with 51
  if (cleaned.startsWith("0")) cleaned = "51" + cleaned.slice(1);
  // If doesn't start with country code, prepend 51 (Peru)
  if (cleaned.length <= 9) cleaned = "51" + cleaned;
  return cleaned;
}

function openWhatsApp(phone: string, message: string) {
  const url = `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export function sendReservationConfirmation(params: {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  locationName: string;
  businessName?: string;
}) {
  const biz = params.businessName || "Tayta Barbershop";
  const message = `✂️ *${biz} — Reserva Confirmada*

¡Hola ${params.clientName}! 👋

Tu cita ha sido registrada exitosamente:

📋 *Servicio:* ${params.serviceName}
💈 *Barbero:* ${params.barberName}
📅 *Fecha:* ${params.date}
🕐 *Hora:* ${params.time}
📍 *Sede:* ${params.locationName}

Te esperamos puntual. Si necesitas reprogramar, contáctanos.

_${biz} — Tu estilo, nuestra pasión_ ✨`;

  openWhatsApp(params.clientPhone, message);
}

export function sendAppointmentReminder(params: {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  barberName: string;
  time: string;
  locationName?: string;
  businessName?: string;
}) {
  const biz = params.businessName || "Tayta Barbershop";
  const message = `⏰ *${biz} — Recordatorio de Cita*

¡Hola ${params.clientName}! 👋

Te recordamos que hoy tienes una cita:

📋 *Servicio:* ${params.serviceName}
💈 *Barbero:* ${params.barberName}
🕐 *Hora:* ${params.time}
${params.locationName ? `📍 *Sede:* ${params.locationName}` : ""}

¡Te esperamos! 🔥

_${biz}_ ✨`;

  openWhatsApp(params.clientPhone, message);
}

export function sendSaleReceipt(params: {
  clientPhone: string;
  clientName: string;
  ticketNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
  businessName?: string;
}) {
  const biz = params.businessName || "Tayta Barbershop";
  const paymentLabels: Record<string, string> = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia",
    wallet: "Wallet Digital",
    mixed: "Pago Mixto",
  };

  const itemsText = params.items
    .map((i) => `  • ${i.quantity > 1 ? `${i.quantity}x ` : ""}${i.name} — S/ ${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  const message = `🧾 *${biz} — Comprobante de Venta*

¡Gracias ${params.clientName}! 👋

*Ticket:* ${params.ticketNumber}
*Fecha:* ${new Date().toLocaleDateString("es-PE")}

*Detalle:*
${itemsText}

💰 *Total: S/ ${params.total.toFixed(2)}*
💳 *Pago: ${paymentLabels[params.paymentMethod] || params.paymentMethod}*

¡Gracias por tu preferencia! Vuelve pronto 🔥

_${biz}_ ✨`;

  openWhatsApp(params.clientPhone, message);
}

export { openWhatsApp, cleanPhone };
