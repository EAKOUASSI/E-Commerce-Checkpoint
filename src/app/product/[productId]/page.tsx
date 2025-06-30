"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProductList from "../../components/ProductList";

interface Product {
  image: string;
  _id: string;
  name: string;
  price: number;
  link: string;
  description: string;
}

const ProductPage = () => {
  const router = useRouter();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/product/${productId}`);
      toast.success(response.data.message);
      router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Erreur lors de la suppression"
        );
        console.error("AxiosError:", error.message);
      } else {
        toast.error("Une erreur inconnue est survenue");
        console.error("Unknown error:", error);
      }
    }
  };

  useEffect(() => {
    if (!productId) return;

    axios
      .get(`/api/product/${productId}`)
      .then((response) => setProduct(response.data.product))
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Produit introuvable");
          console.error("AxiosError:", error.message);
        } else {
          toast.error("Erreur inconnue");
          console.error("Unknown error:", error);
        }
      });
  }, [productId]);

  if (!product) {
    return <p className="text-center py-10">Chargement du produit...</p>;
  }

  return (
    <div className="px-4 md:px-12 bg-[#F8F9FA]">
      <p className="cursor-pointer py-3" onClick={() => router.back()}>
        &larr; Retour
      </p>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center md:space-x-10">
        <Image
          src={product.image}
          alt={product.name}
          width={1000}
          height={1000}
          className="max-w-full md:max-w-xl md:min-w-[30rem] min-h-[28rem] max-h-[28rem] object-cover object-center basis-1/2"
        />

        <div className="basis-1/2 py-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">{product.name}</h2>

            <div className="text-2xl font-bold -mt-2 relative">
              <span
                onClick={() => setOpen(!open)}
                className="cursor-pointer tracking-widest"
              >
                ...
              </span>

              {open && (
                <div className="absolute bg-white shadow-md pb-2 px-5 text-base font-normal right-0 top-10">
                  <Link href={`/product/${product._id}/update`}>
                    <p className="mb-2 pb-2 border-b border-gray-300">
                      Modifier
                    </p>
                  </Link>
                  <p
                    className="text-red-500 cursor-pointer"
                    onClick={handleDelete}
                  >
                    Supprimer
                  </p>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-3xl font-semibold mt-3">
            {/*Afficher le prix en CFA */}
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
              minimumFractionDigits: 0,
            }).format(product.price)}
          </h3>

          <Link href={product.link} target="_blank">
            <button className="mt-8 bg-[#212529] hover:bg-[#343A40] text-white px-3 py-2 w-full font-semibold">
              Contacter le vendeur
            </button>
          </Link>

          <p className="font-semibold mt-10 text-lg">Description</p>
          <p className="mt-1">{product.description}</p>
        </div>
      </div>

      <h2 className="w-full text-2xl font-semibold pt-20">
        Vous pourriez aussi aimer...
      </h2>
      <ProductList />
    </div>
  );
};

export default ProductPage;
