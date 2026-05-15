import { useEffect, useRef } from "react";

interface UseBarcodeScannerProps {
  onScan: (code: string) => void;
  enabled?: boolean;
}

export function useBarcodeScanner({ onScan, enabled = true }: UseBarcodeScannerProps) {
  const buffer = useRef("");
  const lastKeyTime = useRef(dateNow());
  
  function dateNow() {
    return Date.now();
  }

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore functional keys (except Enter)
      if (e.key.length > 1 && e.key !== "Enter") return;

      const currentTime = dateNow();
      const timeDiff = currentTime - lastKeyTime.current;
      lastKeyTime.current = currentTime;

      // Scanners are extremely fast (usually < 30ms between characters)
      // Manual typing is much slower (> 100ms)
      // If the delay between keys is significant, we reset the buffer 
      // as it's likely manual input or a new scan starting.
      if (timeDiff > 100) {
        buffer.current = "";
      }

      if (e.key === "Enter") {
        const code = buffer.current.trim();
        if (code.length >= 3) {
          onScan(code);
          buffer.current = "";
        }
      } else {
        buffer.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onScan, enabled]);
}
