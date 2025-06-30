import mongoose, { Document, Model, Schema } from "mongoose";

// Interface TypeScript pour décrire un produit
export interface IProduct extends Document {
  image: string;
  name: string;
  price: number; // prix en nombre
  link: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // corrigé en Number
    link: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Typage du modèle avec IProduct
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
