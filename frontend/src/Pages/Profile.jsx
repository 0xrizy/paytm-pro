import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { Link } from "react-router-dom";
export default function Profile() {
  const [user, setUser] = useState({});
  const [balance, setBalance] = useState(0);
  const [toggleForm, setToggleForm] = useState(false);
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        alert(err.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const bal = res.data.balance;
        const newBal = Math.round(bal * 100) / 100;
        setBalance(newBal);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    axios.put(
      "http://localhost:3000/api/v1/user",
      { password },
      {
        headers: {
            Authorization: "Bearer " + token,
          },
      }
    ).then((res) => {
      console.log(res);
      alert(res.data.msg);
    })
  }

  return (
    <div className="p-5">
      <div className="p-2 bg-white shadow-lg rounded mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 p-16">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">₹ {balance}</p>
              <p className="text-gray-400">Balance</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <Link
              to="/dashboard"
              className="text-white py-4 px-4 uppercase rounded bg-blue-800 hover:bg-blue-500 shadow hover:shadow-lg font-medium "
            >
              Dashboard
            </Link>
            <Link
              to="/send"
              className="text-white py-4 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium "
            >
              Send Money
            </Link>
          </div>
        </div>
        <div className="mt-20 text-center ">
          <h1 className="text-4xl font-medium text-gray-700">
            {user.fName} {user.lName}{" "}
            <span className="font-light text-gray-500">
              21
            </span>
          </h1>
          <p className="font-light text-gray-600 mt-3">India</p>
        </div>
        <div className="mt-12 flex flex-col justify-center items-center">
          <button
            className="text-white py-2 px-3 w- uppercase rounded bg-blue-800 hover:bg-blue-500 shadow  font-medium"
            onClick={() => setToggleForm(true)}
          >
            Change Password
          </button>
        </div>
        {toggleForm && (
          <div className="mt-12 flex flex-col justify-center mb-10">
            <form className="flex flex-col  items-center border-2 w-3/12 m-auto p-4 rounded-2xl shadow-lg shadow-slate-300 ">
              <label className="text-gray-700 font-medium text-lg my-1">
                Enter New Password:{" "}
              </label>
              <input
                className="border-2 rounded-2xl p-1 w-10/12 mb-2"
                onChange={(e) => setPassword(e.target.value)}
                type="password "
              />
              <button
                className="text-gray-700 py-1 px-2 border-2 rounded-md  uppercase  bg-white hover:bg-blue-500   font-medium"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
