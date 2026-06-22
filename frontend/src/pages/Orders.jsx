import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ConfirmDialog from "../components/ConfirmDialog";

const Orders = () => {
  const { backendUrl, token, currency, navigate, showActionToast } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        navigate("/login", { state: { from: "/orders" } });
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              orderId: order._id,
              itemId: item._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteOrderItem = async (orderId, itemId, size) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/delete-item`,
        { orderId, itemId, size },
        { headers: { token } }
      );

      if (response.data.success) {
        showActionToast({
          title: "Order history updated",
          message: "The ordered item was removed. Click to view your orders.",
          navigateTo: "/orders",
        });
        setPendingDelete(null);
        await loadOrderData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="page-divider border-t pb-10 pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div>
        {orderData.length === 0 ? (
          <p className="py-8 text-gray-600">No orders found.</p>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="surface-panel my-4 flex flex-col gap-4 p-5 text-[#43382f] md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="h-24 w-20 rounded-xl object-cover" src={item.image[0]} alt="" />
                <div>
                  <p className="font-medium sm:text-base">{item.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between md:w-1/2">
                <div className="flex items-center gap-2">
                  <p className="h-2 min-w-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={loadOrderData}
                    className="secondary-action px-4 py-2 text-sm font-medium"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() =>
                      setPendingDelete({
                        orderId: item.orderId,
                        itemId: item.itemId,
                        size: item.size,
                        name: item.name,
                      })
                    }
                    className="danger-action px-4 py-2 text-sm font-medium"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove ordered item?"
        message={`${pendingDelete?.name || "This item"} will be removed from your order history. This action cannot be undone.`}
        confirmLabel="Delete Item"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() =>
          deleteOrderItem(pendingDelete.orderId, pendingDelete.itemId, pendingDelete.size)
        }
      />
    </div>
  );
};

export default Orders;
