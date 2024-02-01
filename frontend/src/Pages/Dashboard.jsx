import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const token = localStorage.getItem("token");
  if (!token) {
    return <div> Invalid token, Please Logout and Login again</div>;
  }
  useEffect(() => {
    axios
      .get("https://paytm-clone.onrender.com/api/v1/account/balance", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const bal = res.data.balance;
        const newBal = Math.round(bal * 100) / 100;
        setBalance(newBal);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="bg-white p-8">
      <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <img
          className="w-full "
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
          alt="dashboard image"
        />
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-gray-900 ">
            Your Current Balance is <br />
            <span className="text-blue-600 font-extrabold text-lg  md:text-4xl">
              <span className="text-sm md:text-4xl">₹</span> {balance}
            </span>
          </h2>
          <p className="mb-6 font-light text-gray-500 md:text-lg ">
            Send money to anyone, instantly. No matter where it is.
          </p>
          <Link
            to="/send"
            className="inline-flex items-center text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Send Money
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          <Link
            className="inline-flex items-center mt-4 text-gray-700 bg-white border border-gray-400 hover:bg-gray-800 hover:text-white ml-4   focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            to="/profile"
          >
           Go to Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
