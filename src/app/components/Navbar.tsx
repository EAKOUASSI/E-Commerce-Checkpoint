"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Mettre à jour l'URL lors du changement de valeur
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("searchTerm", searchTerm);
        router.push(`/search?${params.toString()}`);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, router, searchParams]);

  return (
    <nav className="px-4 md:px-12 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold tracking-wide text-gray-800 hover:text-blue-600 transition"
        >
          KE@-TecH
        </Link>

        {/* Champ de recherche */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Bouton */}
        <Link href="/add-product">
          <button className="bg-[#212529] hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition">
            + Ajouter un article
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
