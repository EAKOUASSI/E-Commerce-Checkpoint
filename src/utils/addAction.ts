"use server";

import { connectDB } from "@/app/api/db/connectDB";
import Product from "@/app/api/models/product.model";
import cloudinary from "./cloudinary";

type AddAction = { success: string } | { error: string };
type CloudinaryUploadResult = {
  secure_url: string;
  [key: string]: unknown;
};

export async function addAction(formData: FormData): Promise<AddAction> {
  try {
    const image = formData.get("image") as File;
    console.log("Image from formData", image);
    const name = formData.get("name")?.toString();
    const price = formData.get("price")?.toString();
    const link = formData.get("link")?.toString();
    const description = formData.get("description")?.toString();

    if (!image || !name || !price || !description || !link) {
      return { error: "Tous les champs sont requis" };
    }

    await connectDB();

    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    console.log("Avant upload_stream");
    console.log("Buffer size:", buffer.length);

    const imageResponse: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "Kea_Shop"
            },
            (error, result) => {
              if (error || !result)
                return reject(new Error("Erreur Cloudinary"));
              return resolve(result as CloudinaryUploadResult);
            }
          )
          .end(buffer);
      }
    );

    await Product.create({
      image: imageResponse.secure_url,
      name,
      price,
      link,
      description
    });

    return { success: "Produit ajouté avec succès" };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Erreur inattendue" };
  }
}
