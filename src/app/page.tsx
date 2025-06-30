import ProductList from "./components/ProductList";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="bg-[#F8F9FA]">
      <Hero />
      <h2 className="w-full text-center text-2xl md:text-4xl font-semibold py-6">
        Tous les produits
      </h2>
      <ProductList />
    </div>
  );
}
