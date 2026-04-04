import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import SideMenu from "./SideMenu";
import { ARIA_LABELS } from "../../utils/config";

import LOGO from "../../assets/logo.svg";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Admin Dashboard", path: "/admin/dashboard" },
  ];

  return <div className="flex gap-5 bg-white border boredr-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black -mt-1"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
        aria-label={openSideMenu ? ARIA_LABELS.MENU_CLOSE : ARIA_LABELS.MENU_OPEN}
        title={openSideMenu ? ARIA_LABELS.MENU_CLOSE : ARIA_LABELS.MENU_OPEN}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <Link to="/" className="shrink-0">
        <img src={LOGO} alt="logo" className="h-[24px] md:h-[26px]" />
      </Link>

      <div className="hidden md:flex items-center gap-2 ml-auto">
        {navLinks.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/admin/dashboard" && location.pathname.startsWith("/admin/edit/"));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                isActive
                  ? "bg-sky-100 text-sky-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
        </div>
      )}
    </div>
};

export default Navbar;
