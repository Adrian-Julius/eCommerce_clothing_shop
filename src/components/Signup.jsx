import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { cartProductsContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const {
    isSignup,
    setIsSignup,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    handleSignup,
  } = useContext(cartProductsContext);
  
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (password && password === confirmPassword) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault(); //

    if (!isReady) {
      alert("Make sure the password and confirm password are the same!");
      return;
    }

    handleSignup();

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="bg-slate-200 w-screen h-screen grid place-items-center">
      <form
        action=""
        onSubmit={handleSubmit}
        className=" w-[90%] md:w-2/3 xl:w-1/3  p-5 sm:p-10 text-[13px] sm:text-lg rounded-xl bg-[linear-gradient(0deg,rgba(191,254,255,1)_19%,rgba(255,236,196,1)_100%)]"
      >
        <h1 className="text-center text-xl sm:text-4xl font-semibold mb-4">
          Sign Up
        </h1>
        <label htmlFor="" className="font-semibold">
          Email:{" "}
        </label>
        <br />
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full p-2 mt-1 mb-5 outline-none rounded-2xl hover:rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          required
          placeholder="example@gmail.com"
        />
        <br />

        <label htmlFor="" className="font-semibold">
          Username:{" "}
        </label>
        <br />
        <input
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="w-full p-2 mt-1 mb-5 outline-none rounded-2xl hover:rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          required
        />
        <br />

        <label htmlFor="" className="font-semibold">
          Password:{" "}
        </label>
        <br />
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="w-full p-2 mt-1 mb-5 outline-none rounded-2xl hover:rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          required
        />
        <br />

        <label htmlFor="" className="font-semibold">
          Confirm Password:
        </label>
        <br />
        <input
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          className="w-full p-2 mt-1 mb-5 outline-none rounded-2xl hover:rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          required
        />
        <br />

        <button
          type="submit"
          className="block font-semibold hover:text-white m-auto bg-slate-300 px-3 py-2 rounded-xl hover:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          Sign Up
        </button>

        <h2 className="text-center text-[10px] sm:text-[14px] mt-3 font-semibold">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="underline underline-offset-2 text-blue-800 hover:text-red-500"
          >
            Log In
          </Link>
        </h2>
      </form>
    </div>
  );
};

export default Signup;
