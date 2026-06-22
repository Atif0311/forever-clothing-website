import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";

const currency = "inr";
const deliveryCharge = 10;

const calculateOrderAmount = (items) =>
  items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0) +
  deliveryCharge;

const removeItemFromOrder = async (order, itemId, size) => {
  const currentItems = Array.isArray(order.items) ? order.items : [];
  const itemIdText = itemId.toString();

  const remainingItems = currentItems.filter((item) => {
    const sameItem = item._id?.toString() === itemIdText;
    const sameSize = item.size === size;
    return !(sameItem && sameSize);
  });

  if (remainingItems.length === currentItems.length) {
    return { success: false, message: "Ordered item not found" };
  }

  if (remainingItems.length === 0) {
    await orderModel.findByIdAndDelete(order._id);
    return { success: true, message: "Order deleted" };
  }

  order.items = remainingItems;
  order.amount = calculateOrderAmount(remainingItems);
  await order.save();

  return { success: true, message: "Ordered item deleted" };
};

const getPaymentErrorMessage = (error, fallbackMessage) => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error?.error?.description) {
    return error.error.description;
  }

  if (error?.description) {
    return error.description;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured in backend/.env");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not configured in backend/.env");
  }

  return new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const stripe = getStripeClient();
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: getPaymentErrorMessage(error, "Unable to start Stripe checkout."),
    });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const razorpayInstance = getRazorpayClient();
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: getPaymentErrorMessage(error, "Unable to start Razorpay checkout."),
    });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const razorpayInstance = getRazorpayClient();
    const { userId, razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: getPaymentErrorMessage(error, "Unable to verify Razorpay payment."),
    });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteUserOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order id is required" });
    }

    const deletedOrder = await orderModel.findOneAndDelete({ _id: orderId, userId });

    if (!deletedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteAdminOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order id is required" });
    }

    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteUserOrderItem = async (req, res) => {
  try {
    const { userId, orderId, itemId, size } = req.body;

    if (!orderId || !itemId || !size) {
      return res.json({ success: false, message: "Order item details are required" });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const result = await removeItemFromOrder(order, itemId, size);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteAdminOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, size } = req.body;

    if (!orderId || !itemId || !size) {
      return res.json({ success: false, message: "Order item details are required" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const result = await removeItemFromOrder(order, itemId, size);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyRazorpay,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  deleteUserOrder,
  deleteAdminOrder,
  deleteUserOrderItem,
  deleteAdminOrderItem,
  updateStatus,
};
