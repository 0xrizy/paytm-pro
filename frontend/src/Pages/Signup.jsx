import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";
export default function Signup() {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form data submitted:", formData);
    await axios
      .post("https://paytm-clone.onrender.com/api/v1/user/signup", formData)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/signin");
        setLoading(false);
      })
      .catch((err) => {
        alert(err.response.data.msg.issues[0].code);
        alert(err.response.data.msg);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <form
      className="max-w-md mx-auto flex flex-col justify-center p-4 bg-white mt-10"
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <label
          htmlFor="fName"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          First Name
        </label>
        <input
          type="text"
          id="fName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="John"
          value={formData.fName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="lName"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Doe"
          value={formData.lName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Your Email
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name@flowbite.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Your Password
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {!loading? 
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
        :
        <div className="flex justify-center">
          <Puff
            height="50"
            width="50"
            radius={1}
            color="gray"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      }
    </form>
  );
}
