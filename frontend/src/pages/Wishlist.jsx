import React, { useContext, useEffect } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";

const Wishlist = () => {
  const { products, wishlistItems, token, navigate } = useContext(ShopContext);

  const wishlistProducts = products.filter((product) =>
    wishlistItems.includes(product._id)
  );

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/wishlist" } });
    }
  }, [token, navigate]);

  return (
    <div className="page-divider border-t pb-10 pt-10">
      <div className="mb-6 text-2xl">
        <Title text1="MY" text2="WISHLIST" />
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="surface-panel py-14 text-center text-[#6b6257]">
          <p>Your wishlist is empty.</p>
          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="primary-action mt-5 px-6 py-3 text-sm"
          >
            BROWSE COLLECTION
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
