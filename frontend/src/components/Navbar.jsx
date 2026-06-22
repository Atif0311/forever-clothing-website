import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    wishlistItems,
    navigate,
    token,
    logout,
  } = useContext(ShopContext);

  return (
    <div className="sticky top-3 z-40 my-3 flex items-center justify-between rounded-full border border-[#d6b46a]/30 bg-[#fffaf2]/90 px-4 py-3 font-medium shadow-[0_14px_40px_rgba(47,40,31,0.10)] backdrop-blur-xl sm:px-6">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      <ul className="hidden gap-7 text-xs font-semibold tracking-[0.12em] text-[#4e563d] sm:flex">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="hidden h-[1.5px] w-2/4 border-none" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="hidden h-[1.5px] w-2/4 border-none" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="hidden h-[1.5px] w-2/4 border-none" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="hidden h-[1.5px] w-2/4 border-none" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 sm:gap-5">
        <button
          type="button"
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe6] hover:bg-white"
          aria-label="Search"
        >
          <img src={assets.search_icon} className="w-4" alt="" />
        </button>

        <Link to="/wishlist" className="relative grid h-9 w-9 place-items-center rounded-full bg-[#f4efe6] text-[22px] leading-none text-[#6f7758] hover:bg-white">
          <span aria-label="Wishlist" role="img">
            {"\u2661"}
          </span>
          {wishlistItems.length > 0 ? (
            <p className="absolute bottom-[-5px] right-[-7px] aspect-square w-4 rounded-full bg-red-500 text-center text-[8px] leading-4 text-white">
              {wishlistItems.length}
            </p>
          ) : null}
        </Link>

        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="h-9 w-9 cursor-pointer rounded-full bg-[#f4efe6] p-2 hover:bg-white"
            src={assets.profile_icon}
            alt=""
          />
          {token ? (
            <div className="dropdown-menu absolute right-0 hidden pt-4 group-hover:block">
              <div className="flex w-40 flex-col gap-2 rounded-2xl border border-[#d6b46a]/30 bg-[#fffaf2] px-5 py-4 text-[#6b6257] shadow-xl">
                <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-black">
                  My Profile
                </p>
                <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black">
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <Link to="/cart" className="relative grid h-9 w-9 place-items-center rounded-full bg-[#f4efe6] hover:bg-white">
          <img src={assets.cart_icon} className="w-4 min-w-4" alt="" />
          <p className="absolute bottom-[-5px] right-[-5px] aspect-square w-4 rounded-full bg-black text-center text-[8px] leading-4 text-white">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      <div
        className={`fixed bottom-0 right-0 top-0 z-50 overflow-hidden bg-[#fffaf2] shadow-2xl transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex cursor-pointer items-center gap-4 p-3">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="border py-2 pl-6" to="/">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="border py-2 pl-6" to="/collection">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="border py-2 pl-6" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="border py-2 pl-6" to="/contact">
            CONTACT
          </NavLink>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              token ? navigate("/orders") : navigate("/login");
            }}
            className="border py-2 pl-6 text-left"
          >
            {token ? "ORDERS" : "LOGIN / SIGN UP"}
          </button>
          {token ? (
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                navigate("/profile");
              }}
              className="border py-2 pl-6 text-left"
            >
              MY PROFILE
            </button>
          ) : null}
          {token ? (
            <button type="button" onClick={logout} className="border py-2 pl-6 text-left">
              LOGOUT
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
