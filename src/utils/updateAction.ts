"use server";

import { connectDB } from "@/app/api/db/connectDB";
import Product from "@/app/api/models/product.model";
import cloudinary from "./cloudinary";

type AddAction = { success: string } | { error: string };
type CloudinaryUploadResult = {
  secure_url: string;
  [key: string]: unknown;
};

export async function updateAction(
  formData: FormData,
  id: string
): Promise<AddAction> {
  try {
    const image = formData.get("image") as File;
    const name = formData.get("name")?.toString();
    const price = formData.get("price")?.toString();
    const link = formData.get("link")?.toString();
    const description = formData.get("description")?.toString();

    if (!name || !price || !link || !description) {
      return { error: "Tous les champs sont requis." };
    }

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return { error: "Produit introuvable." };
    }

    // Cas sans nouvelle image
    if (!image || image.size === 0) {
      await Product.findByIdAndUpdate(id, {
        name,
        price,
        link,
        description
      });

      return { success: "Produit mis à jour avec succès (sans image)." };
    }

    // Supprimer l'ancienne image de Cloudinary
    const parts = product.image.split("/");
    const fileName = parts[parts.length - 1];
    const imageId = fileName.split(".")[0];

    await cloudinary.uploader.destroy(`Kea_Shop/${imageId}`);

    // Upload nouvelle image
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

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
                return reject(new Error("Erreur lors de l'upload Cloudinary"));
              return resolve(result as CloudinaryUploadResult);
            }
          )
          .end(buffer);
      }
    );

    // Mise à jour du produit
    await Product.findByIdAndUpdate(id, {
      image: imageResponse.secure_url,
      name,
      price,
      link,
      description
    });

    return { success: "Produit mis à jour avec succès." };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Erreur inattendue" };
  }
}
