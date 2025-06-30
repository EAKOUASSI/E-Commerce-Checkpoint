import { connectDB } from "../db/connectDB";
import Product from "../models/product.model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("searchTerm");

    let products;

    if (searchTerm) {
      products = await Product.find({
        name: { $regex: searchTerm, $options: "i" },
      }).sort({ createdAt: -1 });
    } else {
      products = await Product.find({}).sort({ createdAt: -1 });
    }

    return Response.json({ products });
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des produits", error);

    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue.";

    return Response.json({ message }, { status: 400 });
  }
}
