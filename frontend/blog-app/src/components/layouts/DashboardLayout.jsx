import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import Footer from "./Footer";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  return  <div className="">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} setOpenSideMenu={()=>{}} />
          </div>

          <div className="grow mx-5 pb-12">{children}</div>
        </div>
      )}

      <Footer />
    </div>
};

export default DashboardLayout;
