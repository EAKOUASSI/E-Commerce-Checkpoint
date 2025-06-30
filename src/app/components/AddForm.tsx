"use client";

import React, { ChangeEvent, useState } from "react";
import { addAction } from "../../utils/addAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AddForm = () => {
  const router = useRouter();
  const [imageURL, setImageURL] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const file = formData.get("image") as File;

    if (!file || file.size === 0 || !file.name) {
      toast.error("Veuillez sélectionner une image valide.");
      return;
    }

    const result = await addAction(formData);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result) {
      toast.success(result.success);
      router.push("/");
      setImageURL("");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeKb = file.size / 1024;
      if (fileSizeKb > 1024) {
        toast.error("Les images de plus de 1 Mo ne sont pas acceptées.");
      } else {
        setImageURL(URL.createObjectURL(file));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="w-full max-w-xl mx-auto flex flex-col justify-center items-center space-y-4 mt-3 md:mt-5"
    >
      {imageURL && (
        <div className="relative w-101 h-72 mb-4 rounded-lg overflow-hidden">
          <Image
            src={imageURL}
            alt="Image du produit"
            fill
            className="object-cover object-center"
          />
        </div>
      )}

      <div className="flex flex-col w-full">
        <label>Image du produit</label>
        <input
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500 cursor-pointer"
          type="file"
          accept="image/*"
          name="image" // ✅ Important
          onChange={handleImageChange}
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Nom:</label>
        <input
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          type="text"
          name="name"
          placeholder="Entrer le nom du produit"
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Prix:</label>
        <input
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          type="text"
          name="price"
          placeholder="Entrer le prix du produit"
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Lien du vendeur:</label>
        <input
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          type="text"
          name="link"
          placeholder="Lien du vendeur"
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label>Description:</label>
        <textarea
          className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          name="description"
          placeholder="Décrivez le produit"
          rows={4}
          required
        ></textarea>
      </div>

      <button
        className="w-full bg-[#212529] px-3 py-2 rounded-md cursor-pointer text-white"
        type="submit"
      >
        Ajouter Produit
      </button>
    </form>
  );
};

export default AddForm;
