import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLoggedInAtom } from "../Recoil/Atoms/atom";
import { useRecoilState } from "recoil";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [token, setToken] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      setToken(token);
      setIsLoggedIn(true);
    } else{
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="bg-white border-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img  
            src="https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
        </Link>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 "
              >
                Home
              </Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link
                  to="/signin"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-gray-700 md:p-0 "
                >
                  SignIn
                </Link>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <Link
                  to="/signup"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-gray-700 md:p-0 "
                >
                  SignUp
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-gray-700 md:p-0 "
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
