import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MenuCard } from "@/components/MenuCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { menuItems, categories } from "@/data/menuData";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen gradient-warm">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/30 to-background pb-8 pt-6">
        <div className="container">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome to <span className="text-primary">CampusBites</span>
            </h1>
            <p className="text-muted-foreground">
              Order delicious food, skip the queue, enjoy your meal!
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6 animate-fade-in">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-full bg-card shadow-card border-0"
            />
          </div>

          {/* Categories */}
          <div className="max-w-2xl mx-auto animate-fade-in">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="container py-8">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No items found. Try a different search or category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
