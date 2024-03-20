import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Puff } from "react-loader-spinner";

export default function Send() {
  const [friends, setFriends] = useState("");
  const [friendArray, setFriendArray] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountToSend, setAmountToSend] = useState("");
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState(0);
  const token = localStorage.getItem("token");
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
  });

  const handleClick = async () => {
    try {
      const response = await axios.get(
        "https://paytm-clone.onrender.com/api/v1/user/bulk",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: {
            fName: friends,
          },
        }
      );

      const users = response.data.userArray;

      if (users.length > 0) {
        setFriendArray(users);
        setNoResults(false);
      } else {
        setFriendArray([]);
        setNoResults(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendClick = (friend) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  const sendTransaction = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://paytm-clone.onrender.com/api/v1/account/transact",
        { amount: parseFloat(amountToSend), to: selectedFriend?._id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("Success");
      setLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      setLoading(false);
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 p-16 ">
      <div className="border-2 border-blue-700 p-2 rounded-xl text-center mb-5">
        <span className="text-md md:text-lg font-semibold text-blue-700">
          Your Balance:
        </span>
        <span className="text-lg md:text-xl text-blue-700 ml-2 font-sans font-bold">
          {balance}
        </span>
      </div>
      <h1 className="text-lg md:text-2xl font-semi md:font-bold bold font-sans mb-5">
        Search for friends
      </h1>
      <form className="flex items-center w-full max-w-md  px-2">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only "
        >
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
            <svg
              className="w-4 h-4 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Search Mockups, Logos..."
            required
            value={friends}
            onChange={(e) => setFriends(e.target.value)}
          />
          <button
            type="button"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
            onClick={handleClick}
          >
            Search
          </button>
        </div>
      </form>
      <div className="mt-10">
        {friendArray.length > 0 ? (
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {friendArray.map((friend) => (
              <li
                key={friend._id}
                className="bg-white border border-blue-500 rounded-xl overflow-hidden p-4 flex flex-col justify-between transition-transform transform hover:scale-105"
              >
                <span className="text-blue-800 text-lg font-semibold mb-2">
                  {friend.fName} {friend.lName} {String(friend._id).slice(-5)}
                </span>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded mt-2"
                  onClick={() => handleSendClick(friend)}
                >
                  Send
                </button>
              </li>
            ))}
          </ul>
        ) : noResults ? (
          <p className="text-gray-500">No results found.</p>
        ) : null}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Send Amount Modal"
        ariaHideApp={false}
        className="h-screen w-screen flex justify-center items-center"
        s
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full ">
          <div className="relative bg-gray-800 rounded-lg shadow ">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                <span className="text-gray-200 ">Sending to:</span>{" "}
                <span className="text-white font-bold font-serif">
                  {selectedFriend?.fName}{" "}
                </span>
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <label className="text-gray-100 font-semibold mr-2">
                Enter Amount :
              </label>
              <input
                type="number"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
                className="border border-gray-500 rounded-md p-1 mb-3"
              />
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                {loading ? (
                  <button
                    onClick={sendTransaction}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Send
                  </button>
                ) : (
                  <div className="flex justify-center items-center ">
                    <Puff color="#00BFFF" height={40} width={40} />
                  </div>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
