import { FC } from "react";
import UpdateForm from "./../../../components/UpdateForm";

interface PageProps {
  params: {
    productId: string;
  };
}

const UpdateProductPage: FC<PageProps> = ({ params }) => {
  return (
    <div className="px-4 md:px-12 bg-[#F8F9FA] pb-8">
      <h2 className="text-center font-semibold pt-8 text-xl md:text-2xl w-full mx-auto">
        Modifier un produit
      </h2>
      <UpdateForm productId={params.productId} />
    </div>
  );
};

export default UpdateProductPage;
