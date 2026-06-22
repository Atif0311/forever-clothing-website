import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { products, currency, addToCart, toggleWishlist, isWishlisted } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const wishlisted = productData ? isWishlisted(productData._id) : false;

  useEffect(() => {
    const found = products.find((item) => item._id === productId);

    if (found) {
      setProductData(found);
      setImage(found.image?.[0] || "");
      setSize("");
    }
  }, [productId, products]);

  return productData ? (
    <div className="page-divider border-t pt-10 opacity-100 transition-opacity duration-500 ease-in">
      <div className="surface-panel flex flex-col gap-12 p-5 sm:flex-row sm:gap-12 sm:p-8">
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex w-full justify-between overflow-x-auto sm:w-[18.7%] sm:flex-col sm:justify-normal sm:overflow-y-scroll">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] flex-shrink-0 cursor-pointer rounded-xl border border-[#d6b46a]/25 sm:mb-3 sm:w-full"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="h-auto w-full rounded-2xl object-cover" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#6f7758]">THE FOREVER EDIT</p>
          <h1 className="prata-regular mt-3 text-3xl leading-tight text-[#2f281f]">{productData.name}</h1>
          <div className="mt-2 flex items-center gap-1">
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 leading-7 text-[#7b7165] md:w-4/5">{productData.description}</p>
          <div className="my-8 flex flex-col gap-4">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`rounded-full border px-4 py-2 ${
                    item === size ? "border-[#6f7758] bg-[#6f7758] text-white" : "border-[#d6b46a]/40 bg-[#f4efe6]"
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                addToCart(productData._id, size, {
                  redirectTo: location.pathname,
                })
              }
              className="primary-action px-8 py-3 text-sm"
            >
              ADD TO CART
            </button>
            <button
              onClick={() =>
                toggleWishlist(productData._id, {
                  redirectTo: location.pathname,
                })
              }
              className={`px-8 py-3 text-sm ${
                wishlisted
                  ? "danger-action"
                  : "secondary-action"
              }`}
            >
              {wishlisted ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>
          <hr className="mt-8 border-[#d6b46a]/25 sm:w-4/5" />
          <div className="mt-5 flex flex-col gap-1 text-sm text-gray-500">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="surface-panel mt-20 overflow-hidden">
        <div className="flex">
          <b className="bg-[#2f281f] px-5 py-3 text-sm text-white">Description</b>
          <p className="px-5 py-3 text-sm text-[#6f7758]">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#d6b46a]/20 px-6 py-6 text-sm leading-7 text-[#7b7165]">
          <p>
            An e-commerce website is an online platform that facilitates the buying
            and selling of products or services over the internet.
          </p>
          <p>
            Products include details such as descriptions, images, prices, sizes,
            and availability to help customers choose what they need.
          </p>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        productId={productData._id}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
