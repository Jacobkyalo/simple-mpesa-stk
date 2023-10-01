import { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function App() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const payNow = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        phone: phone.substring(1),
        amount,
      };
      setLoading(true);
      setSuccess(false);
      setError(false);
      const res = await axios.post("http://localhost:5000/stk", formData);
      setLoading(false);
      setSuccess(
        `${res.data.CustomerMessage} please enter your M-PESA PIN in your phone` ||
          `${res.data.ResponseDescription} please enter your M-PESA PIN in your phone`
      );
      setError(false);

      setPhone("");
      setAmount("");
    } catch (error) {
      setError(true);
      setError(error.message);
    }
  };

  if (error) {
    toast.error(error);
  } else if (success) {
    toast.success(success);
  }

  return (
    <>
      <ToastContainer />
      <section className="flex justify-center items-center h-screen">
        <form
          onSubmit={payNow}
          className="block border border-black rounded-lg p-5 w-full max-w-md"
        >
          <h2 className="mb-6 text-3xl font-bold text-center">
            Pay with <span className="text-green-500">M-PESA</span>
          </h2>
          <div className="mb-4">
            <label htmlFor="phone" className="text-slate-800 block mb-1">
              Phone number
            </label>
            <input
              type="text"
              value={phone}
              id="phone"
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="px-2 py-3 outline-none border border-slate-800 w-full rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="text-slate-800 block mb-1">
              Enter amount
            </label>
            <input
              type="text"
              value={amount}
              id="amount"
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="px-2 py-3 outline-none border border-slate-800 w-full rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="py-3 mt-4 bg-green-500 text-white text-base w-full rounded-md"
          >
            {loading ? `Paying ${amount} ...` : `Pay Now ${amount}`}
          </button>
        </form>
      </section>
    </>
  );
}
