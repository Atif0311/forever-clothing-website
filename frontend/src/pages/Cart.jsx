import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size,
              quantity: cartItems[itemId][size],
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  const proceedToCheckout = () => {
    if (!token) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    navigate("/place-order");
  };

  return (
    <div className="page-divider border-t pb-10 pt-14">
      <div className="mb-3 text-2xl">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div>
        {cartData.length === 0 ? (
          <p className="py-8 text-gray-600">Your cart is empty.</p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            if (!productData) {
              return null;
            }

            return (
              <div
                key={index}
                className="surface-panel my-4 grid grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4 p-4 text-[#43382f] sm:grid-cols-[4fr_2fr_0.5fr]"
              >
                <div className="flex items-start gap-6">
                  <img className="h-24 w-20 rounded-xl object-cover" src={productData.image[0]} alt="" />
                  <div>
                    <p className="text-xs font-medium sm:text-lg">{productData.name}</p>
                    <div className="mt-2 flex items-center gap-5">
                      <p>
                        {currency}
                        {productData.price}
                      </p>
                      <p className="rounded-full border border-[#6f7758]/30 bg-[#f4efe6] px-3 py-1">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  className="max-w-12 rounded-full border px-2 py-2 text-center sm:max-w-20"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="mr-4 w-4 cursor-pointer sm:w-5"
                  src={assets.bin_icon}
                  alt=""
                />
              </div>
            );
          })
        )}
      </div>

      <div className="my-20 flex justify-end">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          {cartData.length > 0 ? (
            <div className="w-full text-end">
              <button
                onClick={proceedToCheckout}
                className="primary-action my-8 px-8 py-3 text-sm"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Cart;
