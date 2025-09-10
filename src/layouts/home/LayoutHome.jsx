import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from 'react';
import { Divider } from "@mui/material";

import Toolbar from '@mui/material/Toolbar';

import Footer from './footer/Footer';
import FooterBottom from "./footer/FooterBottom";

import Header from './header/Header';



function LayoutHome() {
 
  return (
    <>
      <Header />
      {/* ĐANG GỌI TRONG APP.JS */}
      <Toolbar/>

      <main style={{ flexGrow: 1 }}>
        <Outlet />
        {/* kết xuất nội dung các trang được tải vào Layout */}
      </main>

      {/* <Toolbar /> */}

      <Footer />
      {/* <Divider sx={{ my: 2 }} /> */}
      <FooterBottom />
    </>
  )
}
export default LayoutHome;



