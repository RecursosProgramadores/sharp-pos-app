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
  receipt: { includeLogo: true, headerText: "TAYTA BARBERSHOP", footerText: "¡Gracias por tu visita!\nVuelve pronto", includeQR: true, qrImageUrl: "", includeFiscalData: true, fontSize: "medium" },
  vouchers: { boletaPrefix: "B001", facturaPrefix: "F001", notaCreditoPrefix: "NC01", currentBoletaNumber: 1, currentFacturaNumber: 1, currentNotaNumber: 1 },
};

export function ThermalReceipt({
  ticketNumber, items, subtotal, discount, tip, total, paymentMethod,
  cashReceived, change, clientName, clientPhone, barberName,
  businessName, businessAddress, businessRUC,
  onClose,
}: ThermalReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: businessInfo, isLoading: isBusinessLoading } = useSettings("business_info", defaultBusinessInfo);
  const { data: printingConfig, isLoading: isPrintingLoading } = useSettings("printing", defaultPrinting);

  const isSettingsLoading = isBusinessLoading || isPrintingLoading;

  const bInfo = (businessInfo || defaultBusinessInfo) as typeof defaultBusinessInfo;
  const pConfig = (printingConfig || defaultPrinting) as typeof defaultPrinting;

  const resolvedName = businessName || pConfig.receipt.headerText || bInfo.name || "Tayta BarberShop";
  const includeFiscalData = pConfig.receipt.includeFiscalData;
  const resolvedAddress = businessAddress || bInfo.address;
  const resolvedRUC = businessRUC || bInfo.taxId;
  const resolvedPhone = bInfo.phone;
  const footerText = pConfig.receipt.footerText || "¡Gracias por tu visita!\nVuelve pronto";
  const logoUrl = pConfig.receipt.includeLogo ? bInfo.logoUrl : "";
  const fontSizeClass = pConfig.receipt.fontSize === "large" ? "14px" : pConfig.receipt.fontSize === "small" ? "10px" : "12px";

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  
  const partesTicket = ticketNumber.split('-');
  const serieTicket = partesTicket[0] || "B001";
  const numeroTicket = partesTicket[1] || ticketNumber;
  const tipoComprobante = serieTicket.startsWith('F') ? '01' : '03'; 
  
  // Use custom QR image if available, otherwise generate one
  const qrImageUrl = pConfig.receipt.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticketNumber)}&margin=1`;

  const isValid = Boolean(resolvedName && items.length > 0 && total >= 0);

  useEffect(() => {
    if (isSettingsLoading) return;
    
    if (!isValid) {
      console.warn("Faltan datos obligatorios para imprimir el ticket.");
      onClose();
      return;
    }
    const timer = setTimeout(() => handlePrint(), 350);
    return () => clearTimeout(timer);
  }, [isValid, isSettingsLoading]);

  const handlePrint = async () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=450,height=700");
    if (!printWindow) { onClose(); return; }

    const pWidth = pConfig.printerType === "thermal58" ? "58mm" : pConfig.printerType === "thermal80" ? "80mm" : "auto";
    const bWidth = pConfig.printerType === "thermal58" ? "48mm" : pConfig.printerType === "thermal80" ? "72mm" : "100%";

    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Ticket ${ticketNumber}</title>
      <style>
        @page { size: ${pWidth} auto; margin: 0; }
        @media print {
          * { visibility: visible !important; -webkit-print-color-adjust: exact; }
          body { width: ${bWidth}; margin: 0 auto; padding: 0; font-size: ${fontSizeClass}; color: #000; background: #fff; font-family: 'Courier New', monospace; }
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: ${fontSizeClass};
          width: ${bWidth};
          margin: 0 auto;
          padding: 5mm 2mm;
          color: #000;
          line-height: 1.3;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 10px; }
        .logo { width: 40mm; height: auto; display: block; margin: 0 auto 5px; filter: grayscale(100%); }
        .title { font-size: 1.15em; font-weight: bold; text-transform: uppercase; margin-bottom: 3px; }
        .info { font-size: 0.85em; margin-bottom: 1px; }
        
        .separator { margin: 8px 0; border-bottom: 1px dashed #000; }
        
        .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .table-header { border-bottom: 1px dashed #000; margin-bottom: 4px; padding-bottom: 2px; font-weight: bold; }
        
        table { width: 100%; border-collapse: collapse; margin: 5px 0; }
        td { padding: 2px 0; vertical-align: top; }
        .col-qty { width: 15%; }
        .col-desc { width: 55%; }
        .col-total { width: 30%; text-align: right; }
        
        .totals { margin-top: 5px; }
        .total-row { font-size: 1.1em; font-weight: bold; margin-top: 5px; border-top: 1px solid #000; padding-top: 5px; }
        
        .footer { margin-top: 12px; font-size: 0.85em; }
        .qr-container { margin-top: 10px; }
        .qr-img { width: 30mm; height: 30mm; display: block; margin: 0 auto; filter: contrast(120%); }
        .thanks { margin-top: 5px; white-space: pre-line; }
      </style></head><body>${printContent.innerHTML}</body></html>`);

    printWindow.document.close();
    printWindow.focus();

    const imgs = Array.from(printWindow.document.querySelectorAll('img'));
    const imgPromises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    await Promise.all(imgPromises);

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => { printWindow.close(); onClose(); };
      setTimeout(() => { try { printWindow.close(); } catch {} onClose(); }, 3000);
    }, 250);
  };

  const paymentLabels: Record<string, string> = {
    cash: "EFECTIVO", card: "TARJETA", transfer: "TRANSFERENCIA", wallet: "YAPE/PLIN", mixed: "MIXTO"
  };

  const isBoleta = ticketNumber.startsWith("B") || ticketNumber.startsWith("T") || !ticketNumber.startsWith("F");
  const cashierLabel = barberName === "Administrador" ? "Administrador" : `Cajero: ${barberName || "No asignado"}`;

  return (
    <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
      {isValid && !isSettingsLoading && (
        <div ref={printRef}>
          <div className="center header">
            {logoUrl && <img src={logoUrl} alt="Logo" className="logo" />}
            <div className="title">{resolvedName}</div>
            {includeFiscalData && resolvedAddress && <div className="info">{resolvedAddress}</div>}
            {includeFiscalData && resolvedRUC && <div className="info">RUC: {resolvedRUC}</div>}
            {resolvedPhone && <div className="info">Tel: {resolvedPhone}</div>}
          </div>

          <div className="separator" />
          <div className="center bold">
            {!isBoleta ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}
          </div>
          <div className="center bold" style={{ fontSize: '1.1em', marginTop: '2px' }}>
            {serieTicket}-{String(numeroTicket).padStart(7, "0")}
          </div>
          <div className="separator" />

          <div className="row"><span>Fecha: {dateStr}</span><span>Hora: {timeStr}</span></div>
          <div className="row"><span>Cliente:</span><span>{clientName || "Público General"}</span></div>
          <div className="row"><span>{cashierLabel}</span></div>
          
          <div className="separator" />

          <div className="row bold" style={{ fontSize: '0.85em', borderBottom: '1px dashed #000', paddingBottom: '2px' }}>
            <span style={{ width: '15%' }}>CANT</span>
            <span style={{ width: '55%' }}>DESCRIPCIÓN</span>
            <span style={{ width: '30%', textAlign: 'right' }}>TOTAL</span>
          </div>

          <div style={{ marginTop: '5px' }}>
            {items.map((item, i) => (
              <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
                <span style={{ width: '15%' }}>{item.quantity}</span>
                <span style={{ width: '55%' }}>{item.name}</span>
                <span style={{ width: '30%', textAlign: 'right' }}>S/ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="separator" />

          <div className="totals">
            <div className="row">
              <span>Subtotal:</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="row">
                <span>Descuento:</span>
                <span>-S/ {discount.toFixed(2)}</span>
              </div>
            )}
            {tip > 0 && (
              <div className="row">
                <span>Propina:</span>
                <span>S/ {tip.toFixed(2)}</span>
              </div>
            )}
            <div className="row total-row">
              <span className="bold">TOTAL:</span>
              <span className="bold">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="separator" />
          
          <div className="row">
            <span>Pago:</span>
            <span className="bold">{paymentLabels[paymentMethod] || paymentMethod.toUpperCase()}</span>
          </div>
          {cashReceived !== undefined && cashReceived > 0 && (
            <>
              <div className="row"><span>Recibido:</span><span>S/ {cashReceived.toFixed(2)}</span></div>
              <div className="row bold"><span>Cambio:</span><span>S/ {change?.toFixed(2) || "0.00"}</span></div>
            </>
          )}

          <div className="separator" />

          <div className="footer center">
            <div className="thanks">{footerText}</div>
            {pConfig.receipt.includeQR && (
              <div className="qr-container">
                <img src={qrImageUrl} alt="QR" className="qr-img" />
                <div style={{ fontSize: '0.8em', marginTop: '5px', color: '#666' }}>
                  Escanea para dejarnos una reseña
                </div>
              </div>
            )}
            <div style={{ marginTop: "12px", fontSize: "0.8em", color: "#666" }}>
              Representación impresa de la Boleta Electrónica
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
