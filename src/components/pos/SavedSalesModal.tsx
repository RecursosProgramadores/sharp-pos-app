import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, User, PlayCircle, Trash2 } from "lucide-react";

interface SavedSale {
  id: string;
  client: string;
  items: number;
  total: number;
  savedAt: string;
}

interface SavedSalesModalProps {
  open: boolean;
  onClose: () => void;
  savedSales: SavedSale[];
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedSalesModal({ open, onClose, savedSales, onResume, onDelete }: SavedSalesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ventas Guardadas
            <Badge variant="secondary">{savedSales.length}</Badge>
          </DialogTitle>
        </DialogHeader>

        {savedSales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay ventas guardadas</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {savedSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{sale.client}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{sale.items} items</span>
                      <span className="font-display text-foreground">${sale.total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{sale.savedAt}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(sale.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        onResume(sale.id);
                        onClose();
                      }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      Continuar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
