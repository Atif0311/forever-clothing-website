import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const location = useLocation();
  const { token, setToken, navigate, backendUrl, addToCart, getUserCart, pendingCartKey } =
    useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const from =
    typeof location.state?.from === "string"
      ? location.state.from
      : location.state?.from?.pathname || "/";

  const completeAuth = async (authToken) => {
    try {
      const pending = JSON.parse(localStorage.getItem(pendingCartKey) || "null");

      if (pending?.itemId && pending?.size) {
        const added = await addToCart(pending.itemId, pending.size, {
          skipAuthCheck: true,
          authToken,
        });

        localStorage.setItem("token", authToken);
        setToken(authToken);
        await getUserCart(authToken);

        if (added) {
          localStorage.removeItem(pendingCartKey);
        }

        navigate(pending.returnTo || from, { replace: true });
        return;
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem(pendingCartKey);
    }

    localStorage.setItem("token", authToken);
    setToken(authToken);
    navigate(from, { replace: true });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const endpoint = currentState === "Sign Up" ? "/api/user/register" : "/api/user/login";
      const payload =
        currentState === "Sign Up" ? { name, email, password } : { email, password };

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (response.data.success) {
        await completeAuth(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (token) {
    return null;
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      autoComplete="off"
      className="surface-panel m-auto mt-16 flex w-[92%] flex-col items-center gap-4 px-6 py-10 text-[#43382f] sm:max-w-md sm:px-10"
    >
      <div className="mb-2 mt-10 inline-flex items-center gap-2">
        <p className="prata-regular text-4xl">{currentState}</p>
        <hr className="h-[2px] w-8 border-none bg-[#d6b46a]" />
      </div>

      {currentState === "Sign Up" ? (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Name"
          required
        />
      ) : null}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full rounded-xl border px-4 py-3"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        autoComplete="off"
        className="w-full rounded-xl border px-4 py-3"
        placeholder="Password"
        required
      />

      <div className="mt-[-8px] flex w-full justify-between text-sm">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer">
            Create account
          </p>
        ) : (
          <p onClick={() => setCurrentState("Login")} className="cursor-pointer">
            Login Here
          </p>
        )}
      </div>

      <button className="primary-action mt-4 px-10 py-3 text-sm font-medium">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
