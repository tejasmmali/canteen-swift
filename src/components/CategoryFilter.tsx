import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={cn(
            "shrink-0 rounded-full px-4 transition-all",
            activeCategory === category && "shadow-glow"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
