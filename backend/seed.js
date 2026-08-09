// Dev-only helper: seeds MongoDB with sample services so the frontend has
// real data to fetch via the API. Run with: npm run seed
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Service from "./models/Service.js";

dotenv.config();

const services = [
  {
    name: "Hair Cutting",
    slug: "Hair Cutting",
    category: "Hair",
    shortDescription: "Deep-conditioning ritual for silky, nourished hair.",
    description:
      "A restorative hair spa treatment combining steam therapy, scalp massage, and a nutrient-rich mask to repair damage and restore shine.",
    image: "/images/hair-styling.jpg",
    price: 1499,
    duration: "75 min",
    isFeatured: true,
  },
  {
    name: "Pedicure",
    slug: "Nail-art",
    category: "Nails",
    shortDescription: "Precision shaping, cuticle care, and premium polish.",
    description:
      "A relaxing manicure session with hand massage, cuticle treatment, and your choice of premium gel or classic polish finishes.",
    image: "/images/manicure.jpg",
    price: 899,
    duration: "50 min",
    isFeatured: true,
  },
  {
    name: "Nail Extensions",
    slug: "Nail Extensions",
    category: "Nails",
    shortDescription: "Deep cleanse and glow-boosting facial therapy.",
    description:
      "A multi-step facial featuring double cleansing, exfoliation, extraction, and a brightening mask tailored to your skin type.",
    image: "/images/facial-spa.jpg",
    price: 1999,
    duration: "60 min",
    isFeatured: true,
  },
  {
    name: "Facial",
    slug: "Facial",
    category: "Bridal",
    shortDescription: "Facial for your every special day.",
    description:
      "A comprehensive bridal package covering skincare, hair styling consultation, and relaxation treatments in the days before your wedding.",
    image: "/images/skincare.jpg",
    price:999,
    duration: "180 min",
    isFeatured: true,
  },
];

const run = async () => {
  await connectDB();
  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log("Seeded services successfully");
  process.exit(0);
};

run();
