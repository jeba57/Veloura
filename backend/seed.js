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

{
  name: "Bridal Glow Package",
  slug: "bridal-glow-package",
  category: "Bridal",
  shortDescription: "Full bridal makeup and styling for your wedding day.",
  description:
    "A complete bridal preparation service with makeup, hair styling, traditional bridal detailing, and final look preparation.",
  image: "/images/rajasthani-bridal-makeup.jpg",
  price: 5999,
  duration: "180 min",
  isFeatured: true,
},


 {
    name: "Hair Colour & Highlights",
    slug: "hair-colour-highlights",
    category: "Hair",
    shortDescription:
      "Caramel and honey highlights designed to add dimension and shine.",
    description:
      "A personalised hair-colouring service with carefully placed highlights to create natural-looking dimension. Your stylist selects the tone and placement based on your existing hair colour and desired finish.",
    image: "/images/hair-colour-highlights.jpg",
    price: 2499,
    duration: "120 min",
    isFeatured: true,
  },

  {
  name: "Bridal Mehendi",
  slug: "bridal-mehendi",
  category: "Bridal",
  shortDescription:
    "Intricate bridal mehendi with detailed traditional patterns.",
  description:
    "A detailed bridal mehendi session featuring intricate floral, paisley, and traditional Indian patterns applied across the hands and forearms.",
  image: "/images/mehendi.jpg",
  price: 2499,
  duration: "120 min",
  isFeatured: true,
},

{
  name: "Simple Mehendi",
  slug: "Simple-mehendi",
  category: "Bridal",
  shortDescription: "Intricate mehendi designs for hands and forearms.",
  description:
    "Detailed mehendi application featuring traditional floral, paisley, and ornamental patterns for a beautiful bridal finish.",
  image: "/images/simple-mehendi.jpg",
  price: 499,
  duration: "120 min",
  isFeatured: true,
},
{
  name: "Head Massage",
  slug: "relaxing-head-scalp-massage",
  category: "Wellness",
  shortDescription: "A calming scalp massage to ease tension and refresh tired hair.",
  description:
    "A relaxing scalp massage using gentle pressure and slow massage techniques around the scalp, temples, and neck.",
  image: "/images/head-massage.jpg",
  price: 799,
  duration: "40 min",
  isFeatured: false,
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
