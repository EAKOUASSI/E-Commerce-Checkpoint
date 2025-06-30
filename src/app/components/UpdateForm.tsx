"use client";

import { updateAction } from "@/utils/updateAction";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  image: string;
  _id: string;
  name: string;
  price: number;
  link: string;
  description: string;
}

const UpdateForm = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const [imageURL, setImageURL] = useState("");
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (!productId) return; //

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/${productId}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Erreur lors du chargement du produit :", err);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      setImageURL(product.image);
    }
  }, [product]);

  async function clientAddAction(formData: FormData) {
    const result = (await updateAction(formData, productId)) as {
      error?: string;
      success?: string;
    };

    if (result.error) {
      toast.error(result.error);
    }

    if (result.success) {
      toast.success(result.success);
      router.push("/");
      setImageURL("");
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = file.size;

      if (Math.round(fileSize / 1024) > 1024) {
        toast.error("Image greater than 1mb is not allowed.");
      } else {
        setImageURL(URL.createObjectURL(file));
      }
    }
  };

  return (
    <form
      action={clientAddAction}
      className="w-full max-w-xl mx-auto flex flex-col justify-center items-center space-y-4 mt-3 md:mt-5"
    >
      {imageURL && (
        <div className="relative w-72 h-72 mb-4 rounded-lg overflow-hidden">
          <Image
            src={imageURL}
            alt="Image du produit"
            fill
            className="object-contain object-center"
          />
        </div>
      )}

      <div className="flex flex-col w-full">
        <label>Image du produit: </label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Nom: </label>
        <input
          type="text"
          name="name"
          defaultValue={product?.name}
          placeholder="Enter the product name"
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Prix: </label>
        <input
          type="number"
          name="price"
          defaultValue={product?.price}
          placeholder="Enter the product price"
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Lien du vendeur: </label>
        <input
          type="text"
          name="link"
          defaultValue={product?.link}
          placeholder="Link to where buyers can find you"
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Description: </label>
        <textarea
          name="description"
          defaultValue={product?.description}
          placeholder="Enter the product description"
          rows={4}
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#212529] text-white px-3 py-2 rounded-md cursor-pointer"
      >
        Update Product
      </button>
    </form>
  );
};

export default UpdateForm;
