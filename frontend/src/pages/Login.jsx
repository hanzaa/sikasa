import React, { useEffect, useState } from "react";
import { useThemeProvider } from '../utils/ThemeContext';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login(props) {
  const { currentTheme } = useThemeProvider();

  const base_url = import.meta.env.VITE_SERVER_LINK;
  const navigate = useNavigate();
  const location = useLocation();


  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleInput = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post(`${base_url}/login`, {
        username: data.username,
        password: data.password,
      })
      .then((response) => {
        // Handle the successful response here
        console.log("Success:", response.data);

        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('role', response.data.userrole);
        sessionStorage.setItem('token', response.data.token);

        toast.success('Login Berhasil');

        props.setIsLogin(true);
        if (location.state?.from) {
          navigate(location.state.from);
        } else {
          navigate('/grafik/asal');
        }
      })
      .catch((error) => {
        // Handle the error from the API request here
        console.error("API Request Error:", error.response.data.message);
        // You can also display an error message to the user
        // or take other appropriate actions
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const verify = async () => {
      await axios
        .post(`${base_url}/verify`, {
          token: token,
        })
        .then((response) => {
          props.setIsLogin(true);
          if (location.state?.from) {
            navigate(location.state.from);
          } else {
            navigate('/laporan/statistik');
          }
        })
        .catch((error) => {
          // Handle the error from the API request here
          console.error("API Request Error:", error);
          // You can also display an error message to the user
          // or take other appropriate actions
        });
    };

    if (token) {
      verify();
    }
  }, [props.isLogin]);

  // Define dynamic classes based on the current theme
  const containerClasses = `min-h-screen flex flex-col justify-center sm:py-5 ${
    currentTheme === 'light' ? 'bg-white' : 'bg-gray-800'
  }`;
  const textColorClass = currentTheme === 'light' ? 'text-black' : 'text-white';
  const borderColorClass = currentTheme === 'light' ? 'border-gray-300' : 'border-gray-700';
  const bgColorClass = currentTheme === 'light' ? 'bg-slate-100' : 'dark:bg-slate-900';

  return (
    <div className={containerClasses}>
      <div className="p-10 mx-auto xs:p-0 md:w-full md:max-w-md">
        <img
          className="w-24 h-24 mx-auto my-4"
          src="/public/logo_kemhan.png"
          alt=""
        />
        <h1 className={`mx-auto text-center my-4 font-bold text-2xl uppercase tracking-wider ${textColorClass}`}>
          SISTEM INFORMASI KAMAR SANDI
        </h1>{" "}
        <div className={`shadow w-full rounded-lg divide-y divide-gray-200 ${bgColorClass}`}>
          <div className="px-5 py-7">
            <form onSubmit={handleSubmit}>
              <label htmlFor="username" className={`font-semibold text-sm text-gray-600 pb-1 block ${textColorClass}`}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                label="username"
                onChange={handleInput}
                placeholder="Enter your username"
                className={`border rounded-lg ${
                  currentTheme === 'light' ? 'border' : 'border-2'
                } px-3 py-2 mt-1 mb-5 text-sm w-full ${textColorClass} ${borderColorClass} ${bgColorClass} ${currentTheme === 'light' ? 'text-gray-400' : 'text-gray-600'}`}
              />

              <label htmlFor="password" className={`font-semibold text-sm text-gray-600 pb-1 block ${textColorClass}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                label="password"
                onChange={handleInput}
                placeholder="Enter your password"
                className={`border rounded-lg ${
                  currentTheme === 'light' ? 'border' : 'border-2'
                } px-3 py-2 mt-1 mb-5 text-sm w-full ${textColorClass} ${borderColorClass} ${bgColorClass} ${currentTheme === 'light' ? 'text-gray-400' : 'text-gray-600'}`}
              />

              <button
                type="submit"
                className={`transition duration-200 text-white bg-blue-700 hover:bg-blue-600 hover:text-white focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block ${borderColorClass}`}
              >
                <span className="inline-block mr-2">Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="inline-block w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}