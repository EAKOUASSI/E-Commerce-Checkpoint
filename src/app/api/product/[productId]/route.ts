import mongoose from "mongoose";
import cloudinary from "@/utils/cloudinary";
import Product from "../../models/product.model";
import { connectDB } from "../../db/connectDB";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.pathname.split("/").pop();
  console.log("productId reçu:", productId);
  console.log(
    "Is valid ObjectId?",
    mongoose.Types.ObjectId.isValid(productId!)
  );

  await connectDB();

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return new Response(
      JSON.stringify({ message: "ID de produit invalide !" }),
      {
        status: 400
      }
    );
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ message: "Produit introuvable." }), {
        status: 404
      });
    }

    return new Response(JSON.stringify({ product }), { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500
    });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const productId = req.nextUrl.pathname.split("/").pop();

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return new Response(
      JSON.stringify({ message: "ID de produit Invalide !" }),
      {
        status: 400
      }
    );
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(
        JSON.stringify({ message: "Produit introuvable !" }),
        {
          status: 404
        }
      );
    }

    const parts = product.image.split("/");
    const fileName = parts[parts.length - 1];
    const imageId = fileName.split(".")[0];
    await cloudinary.uploader.destroy(`watches/${imageId}`);

    await Product.findByIdAndDelete(productId);

    return new Response(
      JSON.stringify({ message: "Produit supprimé avec succès !" }),
      {
        status: 200
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500
    });
  }
}
