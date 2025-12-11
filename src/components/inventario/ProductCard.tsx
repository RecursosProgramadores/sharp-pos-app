import { useState } from "react";
import { Edit, Trash2, Eye, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  image?: string;
  status: "available" | "out_of_stock" | "low_stock";
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onViewDetails, onDelete }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStockBadgeVariant = () => {
    if (product.stock === 0) return "destructive";
    if (product.stock < 5) return "destructive";
    if (product.stock <= 10) return "warning";
    return "success";
  };

  const getStatusBadge = () => {
    if (product.stock === 0) return { text: "Agotado", variant: "destructive" as const };
    if (product.stock < product.minStock) return { text: "Bajo Stock", variant: "warning" as const };
    return { text: "Disponible", variant: "success" as const };
  };

  const status = getStatusBadge();

  return (
    <div 
      className="card-elevated p-4 relative group transition-all duration-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Action Buttons */}
      <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => onViewDetails(product)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(product)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>SKU: {product.sku}</span>
        </div>

        <p className="font-display text-xl text-primary">${product.price.toFixed(2)}</p>

        <div className="flex items-center justify-between">
          <Badge variant={getStockBadgeVariant()} className="text-xs">
            Stock: {product.stock}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        <Badge variant={status.variant} className="w-full justify-center text-xs">
          {status.text}
        </Badge>
      </div>
    </div>
  );
}
