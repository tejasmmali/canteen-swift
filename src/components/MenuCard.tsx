import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/canteen";
import { useCart } from "@/context/CartContext";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group relative bg-card rounded-2xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-soft hover:-translate-y-1 animate-fade-in">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
          <Badge variant="secondary" className="shrink-0">
            <Clock className="h-3 w-3 mr-1" />
            {item.preparationTime}m
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{item.price}</span>
          <Button 
            size="sm" 
            onClick={() => addItem(item)}
            disabled={!item.available}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {!item.available && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Badge variant="muted" className="text-base px-4 py-2">
            Currently Unavailable
          </Badge>
        </div>
      )}
    </div>
  );
}
