import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: ["Hair", "Skin", "Nails", "Bridal", "Wellness"],
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 160 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g. "60 min"
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
