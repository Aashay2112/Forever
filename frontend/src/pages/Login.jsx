import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {

  const { backendUrl, setToken, isLoggedIn } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [mode,setMode] = useState("login");

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        const response = await axios.post(
          backendUrl + "/api/user/register",
          { name, email, password }
        );

        if (response.data.success) {
          toast.success("Account created! Please login to continue.");
          setMode("login");
          setPassword("");
          return;
        }

        toast.error(response.data.message);
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/user/login",
        { email, password }
      );

      if (response.data.success) {
        setToken(response.data.token);
        navigate(from, { replace: true });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Login Error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center border-t">

      <div className="w-[90%] sm:max-w-md bg-white p-8 border shadow-sm">

        <div className="mb-6 text-center">
          <Title
            text1={mode === "login" ? "LOGIN" : "CREATE"}
            text2={"ACCOUNT"}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              className="border px-3 py-2 focus:outline-none focus:border-black"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="border px-3 py-2 focus:outline-none focus:border-black"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 focus:outline-none focus:border-black"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-black text-white py-2 mt-2 hover:bg-gray-800 transition"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

        </form>

        <div className="flex items-center gap-2 my-6">
          <div className="h-[1px] bg-gray-300 w-full"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-[1px] bg-gray-300 w-full"></div>
        </div>

        <div className="text-center text-sm">

          {mode === "login" ? (
            <>
              <span className="text-gray-500">
                New to Forever?
              </span>

              <button
                onClick={() => {
                  setMode("signup");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="ml-2 font-medium hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-500">
                Already have an account?
              </span>

              <button
                onClick={() => {
                  setMode("login");
                  setEmail("");
                  setPassword("");
                }}
                className="ml-2 font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Login;