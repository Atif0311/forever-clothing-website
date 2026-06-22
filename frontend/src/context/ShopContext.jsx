import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const PENDING_CART_KEY = "pendingAdd";

const ShopContextProvider = ({ children }) => {
  const currency = "\u20B9";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const isAuthFailure = (message = "") => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes("login again") ||
      lowerMessage.includes("not authorized") ||
      lowerMessage.includes("jwt")
    );
  };

  const clearInvalidSession = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlistItems([]);
    toast.error("Please login again.");
    navigate("/login");
  };

  const showActionToast = ({ title, message, accent = "cart", navigateTo = "" }) => {
    const isWishlist = accent === "wishlist";

    toast(
      <div className="forever-toast-card">
        <div className={`forever-toast-icon ${isWishlist ? "wishlist" : "cart"}`}>
          {isWishlist ? "\u2665" : "\u2713"}
        </div>
        <div>
          <p className="forever-toast-title">{title}</p>
          <p className="forever-toast-message">{message}</p>
        </div>
      </div>,
      {
        className: "forever-action-toast",
        bodyClassName: "forever-action-toast-body",
        progressClassName: "forever-action-toast-progress",
        icon: false,
        closeOnClick: true,
        onClick: navigateTo ? () => navigate(navigateTo) : undefined,
      }
    );
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);

      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (authToken = token) => {
    if (!authToken) {
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: authToken } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else if (isAuthFailure(response.data.message)) {
        clearInvalidSession();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserWishlist = async (authToken = token) => {
    if (!authToken) {
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/wishlist`,
        {},
        { headers: { token: authToken } }
      );

      if (response.data.success) {
        setWishlistItems(response.data.wishlistData || []);
      } else if (isAuthFailure(response.data.message)) {
        clearInvalidSession();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleWishlist = async (itemId, options = {}) => {
    const {
      redirectTo = `/product/${itemId}`,
      authToken = token,
    } = options;

    if (!authToken) {
      toast.info("Please sign in or create an account to use wishlist.");
      navigate("/login", { state: { from: redirectTo } });
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/wishlist/toggle`,
        { itemId },
        { headers: { token: authToken } }
      );

      if (response.data.success) {
        setWishlistItems(response.data.wishlistData || []);
        const addedToWishlist = response.data.message?.toLowerCase().includes("added");
        showActionToast({
          title: addedToWishlist ? "Saved for later" : "Wishlist updated",
          message: addedToWishlist
            ? "This item is waiting in your wishlist. Click to view it."
            : "This item was removed. Click to view your wishlist.",
          accent: "wishlist",
          navigateTo: "/wishlist",
        });
        return true;
      }

      if (isAuthFailure(response.data.message)) {
        clearInvalidSession();
        return false;
      }

      toast.error(response.data.message);
      return false;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return false;
    }
  };

  const isWishlisted = (itemId) => wishlistItems.includes(itemId);

  const savePendingCart = (itemId, size, redirectTo) => {
    localStorage.setItem(
      PENDING_CART_KEY,
      JSON.stringify({
        itemId,
        size,
        returnTo: redirectTo,
      })
    );
  };

  const addToCart = async (itemId, size, options = {}) => {
    const {
      skipAuthCheck = false,
      redirectTo = `/product/${itemId}`,
      authToken = token,
      showSuccessToast = true,
    } = options;

    if (!size) {
      toast.error("Select Product Size");
      return false;
    }

    if (!skipAuthCheck && !authToken) {
      savePendingCart(itemId, size, redirectTo);
      toast.info("Please sign in or create an account to add this item.");
      navigate("/login", { state: { from: redirectTo } });
      return false;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    if (authToken) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token: authToken } }
        );

        if (!response.data.success) {
          if (isAuthFailure(response.data.message)) {
            clearInvalidSession();
            return false;
          }

          toast.error(response.data.message);
          await getUserCart(authToken);
          return false;
        }

        if (response.data.cartData) {
          setCartItems(response.data.cartData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        await getUserCart(authToken);
        return false;
      }
    }

    if (showSuccessToast) {
      showActionToast({
        title: "Added to cart",
        message: "Your item is ready for checkout. Click to view cart.",
        accent: "cart",
        navigateTo: "/cart",
      });
    }

    return true;
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalCount += cartItems[itemId][size];
        }
      }
    }

    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );

        if (!response.data.success) {
          if (isAuthFailure(response.data.message)) {
            clearInvalidSession();
            return;
          }

          toast.error(response.data.message);
          await getUserCart(token);
        } else if (response.data.cartData) {
          setCartItems(response.data.cartData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        await getUserCart(token);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);

      if (!itemInfo) {
        continue;
      }

      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      }
    }

    return totalAmount;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(PENDING_CART_KEY);
    setToken("");
    setCartItems({});
    setWishlistItems([]);
    navigate("/login");
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserCart(token);
      getUserWishlist(token);
    } else {
      localStorage.removeItem("token");
      setWishlistItems([]);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    wishlistItems,
    setWishlistItems,
    addToCart,
    showActionToast,
    toggleWishlist,
    isWishlisted,
    getCartCount,
    updateQuantity,
    getCartAmount,
    getCartTotal: getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    getUserCart,
    getUserWishlist,
    logout,
    pendingCartKey: PENDING_CART_KEY,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
