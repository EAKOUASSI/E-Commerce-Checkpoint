import { NextRequest } from "next/server";
import { connectDB } from "../db/connectDB";
import Product from "../models/product.model";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("searchTerm");

    const products = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    }).sort({ createdAt: -1 });

    return Response.json({ products }, { status: 200 });
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des produits");

    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue.";

    return Response.json({ message }, { status: 400 });
  }
}
