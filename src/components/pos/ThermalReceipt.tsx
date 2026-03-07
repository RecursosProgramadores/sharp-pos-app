import { useEffect, useRef } from "react";
import { useSettings } from "@/hooks/useSettings";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  type: "service" | "product";
  barberName?: string;
}

interface ThermalReceiptProps {
  ticketNumber: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  paymentMethod: string;
  cashReceived?: number;
  change?: number;
  clientName: string;
  clientPhone?: string;
  barberName?: string;
  businessName?: string;
  businessAddress?: string;
  businessRUC?: string;
  printerWidth?: "58mm" | "80mm";
  onClose: () => void;
}

const defaultBusinessInfo = {
  name: "Tayta BarberShop", tagline: "", taxId: "", address: "", phone: "", email: "",
  website: "", facebook: "", instagram: "", tiktok: "", mapUrl: "", logoUrl: "",
};

const defaultPrinting = {
  printerType: "thermal58", connectionMethod: "usb", printerName: "POS-58",
  receipt: { includeLogo: true, headerText: "TAYTA BARBERSHOP", footerText: "¡Gracias por tu visita!\nVuelve pronto", includeQR: true, qrUrl: "", includeFiscalData: true, fontSize: "medium" },
  vouchers: { boletaPrefix: "B001", facturaPrefix: "F001", notaCreditoPrefix: "NC01", currentBoletaNumber: 1, currentFacturaNumber: 1, currentNotaNumber: 1 },
};

export function ThermalReceipt({
  ticketNumber, items, subtotal, discount, tip, total, paymentMethod,
  cashReceived, change, clientName, clientPhone, barberName,
  businessName, businessAddress, businessRUC, printerWidth, onClose,
}: ThermalReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: businessInfo } = useSettings("business_info", defaultBusinessInfo);
  const { data: printingConfig } = useSettings("printing", defaultPrinting);

  const bInfo = (businessInfo || defaultBusinessInfo) as typeof defaultBusinessInfo;
  const pConfig = (printingConfig || defaultPrinting) as typeof defaultPrinting;

  const resolvedName = businessName || pConfig.receipt.headerText || bInfo.name;
  const resolvedAddress = businessAddress || bInfo.address;
  const resolvedRUC = businessRUC || bInfo.taxId;
  const resolvedWidth = printerWidth || (pConfig.printerType === "thermal80" ? "80mm" : "58mm");
  const logoUrl = bInfo.logoUrl;
  const qrUrl = pConfig.receipt.qrUrl;
  const footerText = pConfig.receipt.footerText;

  useEffect(() => {
    const timer = setTimeout(() => handlePrint(), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) { onClose(); return; }

    const maxWidth = resolvedWidth === "58mm" ? "48mm" : "72mm";
    const fs = resolvedWidth === "58mm" ? "10px" : "12px";

    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Ticket ${ticketNumber}</title>
      <style>
        @page { margin: 0; size: ${resolvedWidth} auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: ${fs}; width: ${maxWidth}; padding: 4mm 2mm; color: #000; background: #fff; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .title { font-size: ${resolvedWidth === "58mm" ? "13px" : "15px"}; font-weight: bold; letter-spacing: 1px; }
        .divider { border-top: 1px dashed #000; margin: 5px 0; }
        .solid-divider { border-top: 1px solid #000; margin: 4px 0; }
        .row { display: flex; justify-content: space-between; line-height: 1.6; }
        .item-name { flex: 1; padding-right: 4px; }
        .item-price { white-space: nowrap; text-align: right; }
        .total-row { font-size: ${resolvedWidth === "58mm" ? "14px" : "16px"}; font-weight: bold; }
        .footer { margin-top: 8px; font-size: ${resolvedWidth === "58mm" ? "9px" : "10px"}; }
        .sub-text { font-size: ${resolvedWidth === "58mm" ? "8px" : "9px"}; color: #666; }
        .logo { width: 50px; height: 50px; object-fit: contain; margin: 0 auto 4px; display: block; }
        .qr-img { width: 70px; height: 70px; margin: 6px auto; display: block; }
        .header-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #555; }
      </style></head><body>${printContent.innerHTML}</body></html>`);

    printWindow.document.close();
    printWindow.focus();
    printWindow.onafterprint = () => { printWindow.close(); onClose(); };
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => { try { printWindow.close(); } catch {} onClose(); }, 5000);
    }, 500);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  const paymentLabels: Record<string, string> = {
    cash: "EFECTIVO", card: "TARJETA", transfer: "TRANSFERENCIA", wallet: "WALLET DIGITAL", mixed: "PAGO MIXTO",
  };

  return (
    <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
      <div ref={printRef}>
        {/* Logo */}
        {pConfig.receipt.includeLogo && logoUrl && (
          <div className="center">
            <img src={logoUrl} alt="Logo" className="logo" />
          </div>
        )}
        {pConfig.receipt.includeLogo && !logoUrl && (
          <div className="center" style={{ fontSize: "20px", marginBottom: "2px" }}>✂️</div>
        )}

        {/* Header */}
        <div className="center">
          <div className="title">{resolvedName}</div>
          {resolvedAddress && <div className="sub-text">{resolvedAddress}</div>}
          {resolvedRUC && <div className="sub-text">RUC: {resolvedRUC}</div>}
          {bInfo.phone && <div className="sub-text">Tel: {bInfo.phone}</div>}
        </div>

        <div className="divider" />

        <div className="center"><span className="header-label">Boleta de Venta</span></div>
        <div className="row"><span>Ticket:</span><span className="bold">{ticketNumber}</span></div>
        <div className="row"><span>Fecha:</span><span>{dateStr} {timeStr}</span></div>
        <div className="row"><span>Cliente:</span><span>{clientName}</span></div>
        {clientPhone && <div className="row"><span>Tel:</span><span>{clientPhone}</span></div>}
        {barberName && <div className="row"><span>Barbero:</span><span>{barberName}</span></div>}

        <div className="divider" />

        {/* Items */}
        {items.map((item, i) => (
          <div key={i}>
            <div className="row">
              <span className="item-name">{item.quantity > 1 ? `${item.quantity}x ` : ""}{item.name}</span>
              <span className="item-price">S/ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {item.barberName && <div className="sub-text" style={{ paddingLeft: "4px" }}>→ {item.barberName}</div>}
          </div>
        ))}

        <div className="divider" />

        <div className="row"><span>Subtotal:</span><span>S/ {subtotal.toFixed(2)}</span></div>
        {discount > 0 && <div className="row"><span>Descuento:</span><span>-S/ {discount.toFixed(2)}</span></div>}
        {tip > 0 && <div className="row"><span>Propina:</span><span>S/ {tip.toFixed(2)}</span></div>}

        <div className="solid-divider" />

        <div className="row total-row"><span>TOTAL:</span><span>S/ {total.toFixed(2)}</span></div>

        <div className="divider" />

        <div className="row"><span>Pago:</span><span>{paymentLabels[paymentMethod] || paymentMethod.toUpperCase()}</span></div>
        {cashReceived !== undefined && cashReceived > 0 && (
          <>
            <div className="row"><span>Recibido:</span><span>S/ {cashReceived.toFixed(2)}</span></div>
            {change !== undefined && change > 0 && (
              <div className="row bold"><span>Cambio:</span><span>S/ {change.toFixed(2)}</span></div>
            )}
          </>
        )}

        <div className="divider" />

        <div className="center footer" style={{ whiteSpace: "pre-line" }}>{footerText}</div>

        {/* QR Code */}
        {pConfig.receipt.includeQR && qrUrl && (
          <div className="center">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(qrUrl)}`} alt="QR" className="qr-img" />
            <div className="sub-text">Escanea para dejarnos una reseña</div>
          </div>
        )}

        <div className="center footer" style={{ marginTop: "6px", fontSize: "8px" }}>{dateStr} {timeStr}</div>
      </div>
    </div>
  );
}
