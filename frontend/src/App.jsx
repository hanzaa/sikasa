import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Login from "./pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFoundPage from "./NotFoundPage";
import LaporanTujuan from "./pages/LaporanTujuan";
import LaporanAsal from "./pages/LaporanAsal";
import SBMasuk from "./pages/SBMasuk";
import SBKeluar from "./pages/SBKeluar";
import SRMasuk from "./pages/SRMasuk";
import SRKeluar from "./pages/SRKeluar";
import SBKeluarView from "./pages/SBKeluarView";
import SBMasukView from "./pages/SBMasukView";
import SRMasukView from "./pages/SRMasukView";
import SRKeluarView from "./pages/SRKeluarView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";

function App() {
   // Scroll to top when changing location
   const location = useLocation();

   // Scroll to top on route change
   useEffect(() => {
      document.querySelector("html").style.scrollBehavior = "auto";
      window.scroll({ top: 0 });
      document.querySelector("html").style.scrollBehavior = "";
   }, [location.pathname]); // triggered on route change

   const [isLogin, setIsLogin] = useState(false);

   return (
      <>
         <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="colored"
         />{" "}
         <Routes>
            <Route
               index
               path="/"
               element={<Login setIsLogin={setIsLogin} isLogin={isLogin} />}
            />

            <Route
               element={
                  <ProtectedRoutes setIsLogin={setIsLogin} isLogin={isLogin} />
               }
            >
               <Route path="/grafik">
                  <Route path="statistik" element={<AdminPage />} />
                  <Route path="asal" element={<LaporanAsal />} />
                  <Route path="tujuan" element={<LaporanTujuan />} />
               </Route>
               <Route path="/suratbiasa">
                  <Route path="masuk">
                     <Route path="view" element={<SBMasukView />} />
                     <Route path="data" element={<SBMasuk />} />
                  </Route>
                  <Route path="keluar">
                     <Route path="view" element={<SBKeluarView />} />
                     <Route path="data" element={<SBKeluar />} />
                  </Route>
               </Route>
               <Route path="/suratrahasia">
                  <Route path="masuk">
                     <Route path="view" element={<SRMasukView />} />
                     <Route path="data" element={<SRMasuk />} />
                  </Route>
                  <Route path="keluar">
                     <Route path="view" element={<SRKeluarView />} />
                     <Route path="data" element={<SRKeluar />} />
                  </Route>
               </Route>
               <Route path="*" element={<NotFoundPage />} />
            </Route>
         </Routes>
      </>
   );
}

export default App;
