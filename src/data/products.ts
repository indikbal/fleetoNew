export type Product = {
  id: string;
  name: string;
  price: string;
  sale: string | null;
  image: string;
  colors: string[];
  range: string;
  voltage: string;
  speed: string;
};

export const products: Product[] = [
  {
    id: "aayan-smart",
    name: "Aayan-SMART",
    price: "₹57,106",
    sale: "15%",
    image: "/images/hero-scooty.png",
    colors: ["#4A7FEB", "#E05555", "#010101"],
    range: "150 Kms",
    voltage: "60 - 72 Volts",
    speed: "65 kmph",
  },
  {
    id: "udaan",
    name: "Udaan",
    price: "₹57,106",
    sale: null,
    image: "/images/hero-scooty.png",
    colors: ["#4A7FEB", "#E05555", "#010101"],
    range: "150 Kms",
    voltage: "60 - 72 Volts",
    speed: "65 kmph",
  },
  {
    id: "wolf-lite",
    name: "Wolf Lite",
    price: "₹57,106",
    sale: null,
    image: "/images/hero-scooty.png",
    colors: ["#F4A0A0", "#010101", "#333333"],
    range: "150 Kms",
    voltage: "60 - 72 Volts",
    speed: "65 kmph",
  },
  {
    id: "fleeto-x1",
    name: "Fleeto X1",
    price: "₹62,000",
    sale: "10%",
    image: "/images/hero-scooty.png",
    colors: ["#4A7FEB", "#4AAB5E", "#010101"],
    range: "120 Kms",
    voltage: "48 - 72 Volts",
    speed: "70 kmph",
  },
  {
    id: "fleeto-pro",
    name: "Fleeto Pro",
    price: "₹72,500",
    sale: null,
    image: "/images/hero-scooty.png",
    colors: ["#010101", "#AB2323", "#4A7FEB"],
    range: "180 Kms",
    voltage: "72 Volts",
    speed: "80 kmph",
  },
];
