import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order, razorpayKeyId) => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayKeyId;

    if (!window.Razorpay) {
      toast.error("Razorpay checkout is not available right now.");
      return;
    }

    if (!key) {
      toast.error("Razorpay key is not configured.");
      return;
    }

    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            response,
            { headers: { token } }
          );

          if (data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login", { state: { from: "/place-order" } });
      return;
    }

    try {
      const orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );

            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty.");
        navigate("/cart");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
            headers: { token },
          });

          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "razorpay": {
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } }
          );

          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order, responseRazorpay.data.razorpayKeyId);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="page-divider flex min-h-[80vh] flex-col justify-between gap-8 border-t pt-5 sm:flex-row sm:pt-14"
    >
      <div className="surface-panel flex h-fit w-full flex-col gap-4 p-6 sm:max-w-[520px] sm:p-8">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="text" placeholder="Last name" />
        </div>
        <input required onChange={onChangeHandler} name="email" value={formData.email} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="email" placeholder="Email address" />
        <input required onChange={onChangeHandler} name="street" value={formData.street} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="text" placeholder="Street" />
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="city" value={formData.city} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="text" placeholder="City" />
          <input onChange={onChangeHandler} name="state" value={formData.state} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="text" placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="number" placeholder="Zipcode" />
          <input required onChange={onChangeHandler} name="country" value={formData.country} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="text" placeholder="Country" />
        </div>
        <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="w-full rounded border border-gray-300 px-3.5 py-1.5" type="number" placeholder="Phone" />
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex flex-col gap-3 lg:flex-row">
            <div
              onClick={() => setMethod("razorpay")}
              className={`surface-panel flex cursor-pointer items-center gap-3 p-3 px-4 ${method === "razorpay" ? "border-[#6f7758] bg-[#f4efe6]" : ""}`}
            >
              <p className={`h-3.5 min-w-3.5 rounded-full border ${method === "razorpay" ? "bg-green-400" : ""}`}></p>
              <img className="mx-4 h-5" src={assets.razorpay_logo} alt="Razorpay" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className={`surface-panel flex cursor-pointer items-center gap-3 p-3 px-4 ${method === "cod" ? "border-[#6f7758] bg-[#f4efe6]" : ""}`}
            >
              <p className={`h-3.5 min-w-3.5 rounded-full border ${method === "cod" ? "bg-green-400" : ""}`}></p>
              <p className="mx-4 text-sm font-medium text-gray-500">CASH ON DELIVERY</p>
            </div>
          </div>

          <div className="mt-8 w-full text-end">
            <button type="submit" className="primary-action px-16 py-3 text-sm">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
