import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
   const location = useLocation();
   const { pathname } = location;

   const trigger = useRef(null);
   const sidebar = useRef(null);

   const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
   const [sidebarExpanded, setSidebarExpanded] = useState(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
   );

   // close on click outside
   useEffect(() => {
      const clickHandler = ({ target }) => {
         if (!sidebar.current || !trigger.current) return;
         if (
            !sidebarOpen ||
            sidebar.current.contains(target) ||
            trigger.current.contains(target)
         )
            return;
         setSidebarOpen(false);
      };
      document.addEventListener("click", clickHandler);
      return () => document.removeEventListener("click", clickHandler);
   });

   // close if the esc key is pressed
   useEffect(() => {
      const keyHandler = ({ keyCode }) => {
         if (!sidebarOpen || keyCode !== 27) return;
         setSidebarOpen(false);
      };
      document.addEventListener("keydown", keyHandler);
      return () => document.removeEventListener("keydown", keyHandler);
   });

   useEffect(() => {
      localStorage.setItem("sidebar-expanded", sidebarExpanded);
      if (sidebarExpanded) {
         document.querySelector("body").classList.add("sidebar-expanded");
      } else {
         document.querySelector("body").classList.remove("sidebar-expanded");
      }
   }, [sidebarExpanded]);

   return (
      <div>
         {/* Sidebar backdrop (mobile only) */}
         <div
            className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
               sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
         ></div>

         {/* Sidebar */}
         <div
            id="sidebar"
            ref={sidebar}
            className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-60 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-3 transition-all duration-200 ease-in-out ${
               sidebarOpen ? "translate-x-0" : "-translate-x-64"
            }`}
         >
            {/* Sidebar header */}
            <div className="flex justify-between pr-3 mb-7 sm:px-2">
               {/* Close button */}
               <button
                  ref={trigger}
                  className="lg:hidden text-slate-500 hover:text-slate-400"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-controls="sidebar"
                  aria-expanded={sidebarOpen}
               >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                     className="w-6 h-6 fill-current"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                  </svg>
               </button>
               {/* Logo */}
               <NavLink end to="/" className="block mx-auto">
                  <img
                     src="/public/logo_kemhan.png"
                     alt="logo_kemhan"
                     className={
                        sidebarExpanded
                           ? `w-28 h-28 transition text-center`
                           : ""
                     }
                  />
               </NavLink>
            </div>

            {sidebarOpen ? (
               <h1 className="mb-4 text-2xl font-semibold text-center text-white">
                  SIKASA
               </h1>
            ) : (
               <></>
            )}
            {/* Links */}
            <div className="space-y-8">
               {/* Pages group */}
               <div>
                  <h3 className="pl-3 text-xs font-semibold uppercase text-slate-500">
                     <span
                        className="hidden w-6 text-center lg:block lg:sidebar-expanded:hidden 2xl:hidden"
                        aria-hidden="true"
                     >
                        •••
                     </span>
                     <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        Pages
                     </span>
                  </h3>
                  <ul className="mt-3">
                     {/* grafik */}
                     <SidebarLinkGroup
                        activecondition={
                           pathname === "/" || pathname.includes("grafik")
                        }
                     >
                        {(handleClick, open) => {
                           return (
                              <React.Fragment>
                                 <a
                                    href="#0"
                                    className={`block text-slate-200 truncate transition duration-150 ${
                                       pathname === "/" ||
                                       pathname.includes("grafik")
                                          ? "hover:text-slate-200"
                                          : "hover:text-white"
                                    }`}
                                    onClick={(e) => {
                                       e.preventDefault();
                                       sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                    }}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center">
                                          <svg
                                             className="w-6 h-6 shrink-0"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes("grafik")
                                                      ? "text-indigo-300"
                                                      : "text-slate-400"
                                                }`}
                                                d="M13 6.068a6.035 6.035 0 0 1 4.932 4.933H24c-.486-5.846-5.154-10.515-11-11v6.067Z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes("grafik")
                                                      ? "text-indigo-500"
                                                      : "text-slate-700"
                                                }`}
                                                d="M18.007 13c-.474 2.833-2.919 5-5.864 5a5.888 5.888 0 0 1-3.694-1.304L4 20.731C6.131 22.752 8.992 24 12.143 24c6.232 0 11.35-4.851 11.857-11h-5.993Z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes("grafik")
                                                      ? "text-indigo-600"
                                                      : "text-slate-600"
                                                }`}
                                                d="M6.939 15.007A5.861 5.861 0 0 1 6 11.829c0-2.937 2.167-5.376 5-5.85V0C4.85.507 0 5.614 0 11.83c0 2.695.922 5.174 2.456 7.17l4.483-3.993Z"
                                             />
                                          </svg>
                                          <span className="ml-3 text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                             Grafik
                                          </span>
                                       </div>
                                       {/* Icon */}
                                       <div className="flex ml-2 shrink-0">
                                          <svg
                                             className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                                open && "rotate-180"
                                             }`}
                                             viewBox="0 0 12 12"
                                          >
                                             <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                          </svg>
                                       </div>
                                    </div>
                                 </a>
                                 <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                                    <ul
                                       className={`pl-9 mt-1 ${
                                          !open && "hidden"
                                       }`}
                                    >
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/grafik/asal"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                Berdasarkan Asal
                                             </span>
                                          </NavLink>
                                       </li>
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/grafik/tujuan"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                Berdasarkan Tujuan
                                             </span>
                                          </NavLink>
                                       </li>
                                    </ul>
                                 </div>
                              </React.Fragment>
                           );
                        }}
                     </SidebarLinkGroup>
                     {/* Surat Biasa Masuk */}
                     <SidebarLinkGroup
                        activecondition={pathname.includes("suratbiasa/masuk")}
                     >
                        {(handleClick, open) => {
                           return (
                              <React.Fragment>
                                 <a
                                    href="#0"
                                    className={`block text-slate-200 truncate transition duration-150 ${
                                       pathname.includes("suratbiasa/masuk")
                                          ? "hover:text-slate-200"
                                          : "hover:text-white"
                                    }`}
                                    onClick={(e) => {
                                       e.preventDefault();
                                       sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                    }}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center">
                                          <svg
                                             className="w-6 h-6 shrink-0"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratbiasa/masuk"
                                                   )
                                                      ? "text-indigo-300"
                                                      : "text-slate-400"
                                                }`}
                                                d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratbiasa/masuk"
                                                   )
                                                      ? "text-indigo-600"
                                                      : "text-slate-700"
                                                }`}
                                                d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratbiasa/masuk"
                                                   )
                                                      ? "text-indigo-500"
                                                      : "text-slate-600"
                                                }`}
                                                d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
                                             />
                                          </svg>
                                          <span className="ml-3 text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                             Surat Biasa Masuk
                                          </span>
                                       </div>
                                       {/* Icon */}
                                       <div className="flex ml-2 shrink-0">
                                          <svg
                                             className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                                open && "rotate-180"
                                             }`}
                                             viewBox="0 0 12 12"
                                          >
                                             <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                          </svg>
                                       </div>
                                    </div>
                                 </a>
                                 <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                                    <ul
                                       className={`pl-9 mt-1 ${
                                          !open && "hidden"
                                       }`}
                                    >
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratbiasa/masuk/view"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                View
                                             </span>
                                          </NavLink>
                                       </li>
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratbiasa/masuk/data"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                             Export
                                             </span>
                                          </NavLink>
                                       </li>
                                    </ul>
                                 </div>
                              </React.Fragment>
                           );
                        }}
                     </SidebarLinkGroup>
                     {/* Surat Biasa Keluar */}
                     <SidebarLinkGroup
                        activecondition={pathname.includes("suratbiasa/keluar")}
                     >
                        {(handleClick, open) => {
                           return (
                              <React.Fragment>
                                 <a
                                    href="#0"
                                    className={`block text-slate-200 truncate transition duration-150 ${
                                       pathname.includes("ecommerce")
                                          ? "hover:text-slate-200"
                                          : "hover:text-white"
                                    }`}
                                    onClick={(e) => {
                                       e.preventDefault();
                                       sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                    }}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center">
                                          <svg
                                             className="w-6 h-6 shrink-0"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratbiasa/keluar"
                                                   )
                                                      ? "text-indigo-300"
                                                      : "text-slate-400"
                                                }`}
                                                d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratbiasa/keluar"
                                                   )
                                                      ? "text-indigo-600"
                                                      : "text-slate-700"
                                                }`}
                                                d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratbiasa/keluar"
                                                   )
                                                      ? "text-indigo-500"
                                                      : "text-slate-600"
                                                }`}
                                                d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
                                             />
                                          </svg>
                                          <span className="ml-3 text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                             Surat Biasa Keluar
                                          </span>
                                       </div>
                                       {/* Icon */}
                                       <div className="flex ml-2 shrink-0">
                                          <svg
                                             className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                                open && "rotate-180"
                                             }`}
                                             viewBox="0 0 12 12"
                                          >
                                             <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                          </svg>
                                       </div>
                                    </div>
                                 </a>
                                 <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                                    <ul
                                       className={`pl-9 mt-1 ${
                                          !open && "hidden"
                                       }`}
                                    >
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratbiasa/keluar/view"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                View
                                             </span>
                                          </NavLink>
                                       </li>
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratbiasa/keluar/data"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                Export
                                             </span>
                                          </NavLink>
                                       </li>
                                    </ul>
                                 </div>
                              </React.Fragment>
                           );
                        }}
                     </SidebarLinkGroup>
                     {/* Surat Rahasia Masuk */}
                     <SidebarLinkGroup
                        activecondition={pathname.includes("suratrahasia/masuk")}
                     >
                        {(handleClick, open) => {
                           return (
                              <React.Fragment>
                                 <a
                                    href="#0"
                                    className={`block text-slate-200 truncate transition duration-150 ${
                                       pathname.includes("suratrahasia/masuk")
                                          ? "hover:text-slate-200"
                                          : "hover:text-white"
                                    }`}
                                    onClick={(e) => {
                                       e.preventDefault();
                                       sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                    }}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center">
                                          <svg
                                             className="w-6 h-6 shrink-0"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratrahasia/masuk"
                                                   )
                                                      ? "text-indigo-300"
                                                      : "text-slate-400"
                                                }`}
                                                d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratrahasia/masuk"
                                                   )
                                                      ? "text-indigo-600"
                                                      : "text-slate-700"
                                                }`}
                                                d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratrahasia/masuk"
                                                   )
                                                      ? "text-indigo-500"
                                                      : "text-slate-600"
                                                }`}
                                                d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
                                             />
                                          </svg>
                                          <span className="ml-3 text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                             Surat Rahasia Masuk
                                          </span>
                                       </div>
                                       {/* Icon */}
                                       <div className="flex ml-2 shrink-0">
                                          <svg
                                             className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                                open && "rotate-180"
                                             }`}
                                             viewBox="0 0 12 12"
                                          >
                                             <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                          </svg>
                                       </div>
                                    </div>
                                 </a>
                                 <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                                    <ul
                                       className={`pl-9 mt-1 ${
                                          !open && "hidden"
                                       }`}
                                    >
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratrahasia/masuk/view"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                View
                                             </span>
                                          </NavLink>
                                       </li>
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratrahasia/masuk/data"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                Export
                                             </span>
                                          </NavLink>
                                       </li>
                                    </ul>
                                 </div>
                              </React.Fragment>
                           );
                        }}
                     </SidebarLinkGroup>
                     {/* Surat Rahasia Keluar */}
                     <SidebarLinkGroup
                        activecondition={pathname.includes("suratrahasia/keluar")}
                     >
                        {(handleClick, open) => {
                           return (
                              <React.Fragment>
                                 <a
                                    href="#0"
                                    className={`block text-slate-200 truncate transition duration-150 ${
                                       pathname.includes("suratrahasia/keluar")
                                          ? "hover:text-slate-200"
                                          : "hover:text-white"
                                    }`}
                                    onClick={(e) => {
                                       e.preventDefault();
                                       sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                    }}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center">
                                          <svg
                                             className="w-6 h-6 shrink-0"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratrahasia/keluar"
                                                   )
                                                      ? "text-indigo-300"
                                                      : "text-slate-400"
                                                }`}
                                                d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratrahasia/keluar"
                                                   )
                                                      ? "text-indigo-600"
                                                      : "text-slate-700"
                                                }`}
                                                d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
                                             />
                                             <path
                                                className={`fill-current ${
                                                   pathname.includes(
                                                      "suratrahasia/keluar"
                                                   )
                                                      ? "text-indigo-500"
                                                      : "text-slate-600"
                                                }`}
                                                d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
                                             />
                                          </svg>
                                          <span className="ml-3 text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                             Surat Rahasia Keluar
                                          </span>
                                       </div>
                                       {/* Icon */}
                                       <div className="flex ml-2 shrink-0">
                                          <svg
                                             className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                                open && "rotate-180"
                                             }`}
                                             viewBox="0 0 12 12"
                                          >
                                             <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                          </svg>
                                       </div>
                                    </div>
                                 </a>
                                 <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                                    <ul
                                       className={`pl-9 mt-1 ${
                                          !open && "hidden"
                                       }`}
                                    >
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratrahasia/keluar/view"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                View
                                             </span>
                                          </NavLink>
                                       </li>
                                       <li className="mb-1 last:mb-0">
                                          <NavLink
                                             end
                                             to="/suratrahasia/keluar/data"
                                             className={({ isActive }) =>
                                                "block transition duration-150 truncate " +
                                                (isActive
                                                   ? "text-indigo-500"
                                                   : "text-slate-400 hover:text-slate-200")
                                             }
                                          >
                                             <span className="text-xs font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                                                Export
                                             </span>
                                          </NavLink>
                                       </li>
                                    </ul>
                                 </div>
                              </React.Fragment>
                           );
                        }}
                     </SidebarLinkGroup>
                  </ul>
               </div>
            </div>

            {/* Expand / collapse button */}
            <div className="justify-end hidden pt-3 mt-auto lg:inline-flex 2xl:hidden">
               <div className="px-3 py-2">
                  <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                     <span className="sr-only">Expand / collapse sidebar</span>
                     <svg
                        className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                        viewBox="0 0 24 24"
                     >
                        <path
                           className="text-slate-400"
                           d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                        />
                        <path className="text-slate-600" d="M3 23H1V1h2z" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Sidebar;
