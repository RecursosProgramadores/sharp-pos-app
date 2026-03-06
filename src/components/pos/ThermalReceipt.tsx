import { useEffect, useRef } from "react";

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

export function ThermalReceipt({
  ticketNumber,
  items,
  subtotal,
  discount,
  tip,
  total,
  paymentMethod,
  cashReceived,
  change,
  clientName,
  clientPhone,
  barberName,
  businessName = "TAYTA BARBERSHOP",
  businessAddress = "",
  businessRUC = "",
  printerWidth = "58mm",
  onClose,
}: ThermalReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePrint();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
      onClose();
      return;
    }

    const maxWidth = printerWidth === "58mm" ? "48mm" : "72mm";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Ticket ${ticketNumber}</title>
        <style>
          @page { margin: 0; size: ${printerWidth} auto; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace;
            font-size: ${printerWidth === "58mm" ? "10px" : "12px"};
            width: ${maxWidth};
            padding: 4mm 2mm;
            color: #000;
            background: #fff;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .title { font-size: ${printerWidth === "58mm" ? "14px" : "16px"}; font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 4px 0; }
          .row { display: flex; justify-content: space-between; line-height: 1.6; }
          .item-name { flex: 1; padding-right: 4px; }
          .item-price { white-space: nowrap; text-align: right; }
          .total-row { font-size: ${printerWidth === "58mm" ? "14px" : "16px"}; font-weight: bold; }
          .footer { margin-top: 8px; font-size: ${printerWidth === "58mm" ? "9px" : "10px"}; }
          .qr-placeholder { 
            width: 60px; height: 60px; margin: 6px auto; 
            border: 1px solid #000; display: flex; 
            align-items: center; justify-content: center; font-size: 8px; 
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.onafterprint = () => {
      printWindow.close();
      onClose();
    };

    setTimeout(() => {
      printWindow.print();
      // Fallback close after timeout
      setTimeout(() => {
        try { printWindow.close(); } catch {}
        onClose();
      }, 5000);
    }, 500);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  const paymentLabels: Record<string, string> = {
    cash: "EFECTIVO",
    card: "TARJETA",
    transfer: "TRANSFERENCIA",
    wallet: "WALLET DIGITAL",
    mixed: "PAGO MIXTO",
  };

  return (
    <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
      <div ref={printRef}>
        {/* Header */}
        <div className="center">
          <div style={{ fontSize: "20px", marginBottom: "2px" }}>✂️</div>
          <div className="title">{businessName}</div>
          {businessAddress && <div>{businessAddress}</div>}
          {businessRUC && <div>RUC: {businessRUC}</div>}
        </div>

        <div className="divider" />

        {/* Ticket info */}
        <div className="center" style={{ fontSize: "9px" }}>
          BOLETA DE VENTA
        </div>
        <div className="row">
          <span>Ticket:</span>
          <span className="bold">{ticketNumber}</span>
        </div>
        <div className="row">
          <span>Fecha:</span>
          <span>{dateStr} {timeStr}</span>
        </div>
        <div className="row">
          <span>Cliente:</span>
          <span>{clientName}</span>
        </div>
        {clientPhone && (
          <div className="row">
            <span>Tel:</span>
            <span>{clientPhone}</span>
          </div>
        )}
        {barberName && (
          <div className="row">
            <span>Barbero:</span>
            <span>{barberName}</span>
          </div>
        )}

        <div className="divider" />

        {/* Items */}
        {items.map((item, i) => (
          <div key={i}>
            <div className="row">
              <span className="item-name">
                {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.name}
              </span>
              <span className="item-price">
                S/ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            {item.barberName && (
              <div style={{ fontSize: "8px", paddingLeft: "4px", color: "#666" }}>
                → {item.barberName}
              </div>
            )}
          </div>
        ))}

        <div className="divider" />

        {/* Totals */}
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

        <div className="divider" />

        <div className="row total-row">
          <span>TOTAL:</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>

        <div className="divider" />

        {/* Payment info */}
        <div className="row">
          <span>Pago:</span>
          <span>{paymentLabels[paymentMethod] || paymentMethod.toUpperCase()}</span>
        </div>
        {cashReceived !== undefined && cashReceived > 0 && (
          <>
            <div className="row">
              <span>Recibido:</span>
              <span>S/ {cashReceived.toFixed(2)}</span>
            </div>
            {change !== undefined && change > 0 && (
              <div className="row bold">
                <span>Cambio:</span>
                <span>S/ {change.toFixed(2)}</span>
              </div>
            )}
          </>
        )}

        <div className="divider" />

        {/* Footer */}
        <div className="center footer">
          <div>¡Gracias por tu visita!</div>
          <div>Vuelve pronto</div>
          <div style={{ marginTop: "4px", fontSize: "8px" }}>
            {dateStr} {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
