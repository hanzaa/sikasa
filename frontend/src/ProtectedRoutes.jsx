import React, { useState, useEffect } from 'react';
import { Outlet,Navigate,useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { toast } from 'react-toastify';


// Import Sidebar and Header
import Sidebar from './partials/Sidebar';
import Header from './partials/Header';

//custom MUI color
const theme = createTheme({
    palette: {
      primary: {
        main: '#5C0000',
        // light: will be calculated from palette.primary.main,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: '#CAAA55',
        // dark: will be calculated from palette.secondary.main,
        // light: will be calculated from palette.secondary.main,
        // dark: will be calculated from palette.secondary.main,
        // contrastText: will be calculated to contrast with palette.secondary.main
      },
    },
  });

export default function ProtectedRoutes(props) {
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    
    const verify = async () => {
      await axios
      .post(`${import.meta.env.VITE_SERVER_LINK}/verify`, {
        token: sessionStorage.getItem('token'),
      })
      .then((response) => {
          // Handle the successful response here
          console.log("Success:", response);
          return true
        })
      .catch((error) => {
        // Handle the error from the API request here
        props.setIsLogin(false);
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('token');
        toast.warn('You are not logged in');
        return false
        // You can also display an error message to the user
        // or take other appropriate actions
      });
    };

    
    const useAuth = () => {
      return verify() && props.isLogin;
      
    };

    const isAuth = useAuth();

    return (
        isAuth ? 
        <>
       
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
                {/* Content area */}
                <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-visible">
        
                    {/*  Site header */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setIsLogin={props.setIsLogin} />
                    <ThemeProvider theme={theme}>
                        <Outlet/> 
                    </ThemeProvider>

                </div>
            </div>
        
        </>
  
        
        : <Navigate to="/" replace state={{from: location}}/>
    )
}