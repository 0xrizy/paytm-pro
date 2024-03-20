import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import {isLoggedInAtom} from "../Recoil/Atoms/atom"
export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [token, setToken] = useState();

  return (
    <section className="bg-white h-full">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl font-serif text-gray-700">
            <span className="text-sky-800">Pay</span><span className="text-blue-600">tm</span>: Empowering Digital Transactions for a Seamless Tomorrow
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-700 lg:mb-8 md:text-lg lg:text-xl ">
            Transforming Payments, Enriching Lives - Your Gateway to a Cashless
            Future
          </p>
          { !isLoggedIn && <Link
          to="/signin"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 "
          >
           SignIn
          </Link>}
          { isLoggedIn && <Link
          to="/signin"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center bg-blue-700 text-white border border-gray-300 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-gray-100 "
          >
           Go to Dashboard
          </Link>}
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img
            src="https://1000logos.net/wp-content/uploads/2021/03/Paytm_Logo.jpg"
            alt="mockup"
          />
        </div>
      </div>
    </section>
  );
}
