"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "./../api/models/product.model";

interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
}

const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("/api/fetch-products")
      .then((response) => setProducts(response.data.products));
  }, []);
  return (
    <div
      id="product"
      className="px-4 md:px-12 py-5 md:py-10 flex justify-center items-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product: Product, index) => (
          <Link href={`/product/${product._id}`} key={index}>
            <Image
              src={product.image}
              alt="img"
              width={1000}
              height={1000}
              className="max-w-[17rem] h72 object-cover object-center rounded-lg "
            />
            <div className="mt-4">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="font-medium text -sm mt-1">{product.price} FCFA</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ProductList;
