import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
  };
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  
  return (
    <button
      onClick={onClick}
      disabled={isOutOfStock}
      className="relative flex flex-col items-center p-3 md:p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted flex items-center justify-center mb-2 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      
      {isLowStock && !isOutOfStock && (
        <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] px-1.5">
          Stock: {product.stock}
        </Badge>
      )}
      
      {isOutOfStock && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] px-1.5">
          Agotado
        </Badge>
      )}
      
      <span className="font-medium text-xs md:text-sm text-center line-clamp-2 leading-tight">
        {product.name}
      </span>
      <span className="font-display text-lg md:text-xl text-primary mt-1">
        ${product.price.toFixed(2)}
      </span>
    </button>
  );
}
