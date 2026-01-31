import { MenuItem } from "@/types/canteen";
import masalaDosa from "@/assets/masala-dosa.jpg";
import idliSambar from "@/assets/idli-sambar.jpg";
import vegBiryani from "@/assets/veg-biryani.jpg";
import paneerButterMasala from "@/assets/paneer-butter-masala.jpg";
import chickenFriedRice from "@/assets/chicken-fried-rice.jpg";
import vegSandwich from "@/assets/veg-sandwich.jpg";
import samosa from "@/assets/samosa.jpg";
import frenchFries from "@/assets/french-fries.jpg";
import masalaChai from "@/assets/masala-chai.jpg";
import coldCoffee from "@/assets/cold-coffee.jpg";
import limeSoda from "@/assets/lime-soda.jpg";
import gulabJamun from "@/assets/gulab-jamun.jpg";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato, served with sambar and chutneys",
    price: 60,
    category: "Breakfast",
    image: masalaDosa,
    available: true,
    preparationTime: 10,
  },
  {
    id: "2",
    name: "Idli Sambar",
    description: "Soft steamed rice cakes served with lentil soup and coconut chutney",
    price: 40,
    category: "Breakfast",
    image: idliSambar,
    available: true,
    preparationTime: 8,
  },
  {
    id: "3",
    name: "Veg Biryani",
    description: "Aromatic basmati rice cooked with mixed vegetables and fragrant spices",
    price: 90,
    category: "Main Course",
    image: vegBiryani,
    available: true,
    preparationTime: 15,
  },
  {
    id: "4",
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in rich, creamy tomato gravy with butter",
    price: 120,
    category: "Main Course",
    image: paneerButterMasala,
    available: true,
    preparationTime: 12,
  },
  {
    id: "5",
    name: "Chicken Fried Rice",
    description: "Wok-tossed rice with tender chicken pieces and fresh vegetables",
    price: 100,
    category: "Main Course",
    image: chickenFriedRice,
    available: true,
    preparationTime: 12,
  },
  {
    id: "6",
    name: "Veg Sandwich",
    description: "Grilled sandwich with fresh vegetables, cheese and mint chutney",
    price: 50,
    category: "Snacks",
    image: vegSandwich,
    available: true,
    preparationTime: 8,
  },
  {
    id: "7",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas (2 pcs)",
    price: 30,
    category: "Snacks",
    image: samosa,
    available: true,
    preparationTime: 5,
  },
  {
    id: "8",
    name: "French Fries",
    description: "Golden crispy potato fries with tomato ketchup",
    price: 60,
    category: "Snacks",
    image: frenchFries,
    available: true,
    preparationTime: 8,
  },
  {
    id: "9",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk",
    price: 20,
    category: "Beverages",
    image: masalaChai,
    available: true,
    preparationTime: 5,
  },
  {
    id: "10",
    name: "Cold Coffee",
    description: "Chilled coffee blended with milk and ice cream",
    price: 50,
    category: "Beverages",
    image: coldCoffee,
    available: true,
    preparationTime: 5,
  },
  {
    id: "11",
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda water and mint",
    price: 35,
    category: "Beverages",
    image: limeSoda,
    available: true,
    preparationTime: 3,
  },
  {
    id: "12",
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup (2 pcs)",
    price: 40,
    category: "Desserts",
    image: gulabJamun,
    available: true,
    preparationTime: 3,
  },
];

export const categories = ["All", "Breakfast", "Main Course", "Snacks", "Beverages", "Desserts"];
