import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const SearchBar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  return showSearch && visible ? (
    <div className="surface-panel my-5 text-center">
      <div className="mx-3 my-5 inline-flex w-3/4 items-center justify-center rounded-full border border-[#6f7758]/35 bg-white/70 px-5 py-3 shadow-inner sm:w-1/2">
        <input
          className="flex-1 border-none bg-transparent text-sm outline-none shadow-none"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search"
        />
        <img className="w-4" src={assets.search_icon} alt="" />
      </div>
      <button type="button" onClick={() => setShowSearch(false)} className="mr-4 inline-grid h-8 w-8 place-items-center rounded-full bg-[#eee4d4]" aria-label="Close search">
        <img className="w-3" src={assets.cross_icon} alt="" />
      </button>
    </div>
  ) : null;
};

export default SearchBar;
