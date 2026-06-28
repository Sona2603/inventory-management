import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
function Login() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.access
      );

      toast.success("Login Successful");

      window.location.href = "/";

    } catch (error) {

      console.error(error);

      toast.error("Invalid Credentials");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-gray-900
      via-blue-900
      to-black
      px-4
      "
    >

      <div
        className="
        grid
        md:grid-cols-2
        bg-white/10
        backdrop-blur-lg
        border
        border-white/20
        rounded-3xl
        shadow-2xl
        overflow-hidden
        max-w-5xl
        w-full
        "
      >

        {/* LEFT SIDE */}

        <div
          className="
          hidden
          md:flex
          flex-col
          justify-center
          items-center
          p-10
          text-white
          bg-gradient-to-br
          from-blue-600/30
          to-purple-600/30
          "
        >

          <h1 className="text-5xl font-bold mb-6">
            Inventory
          </h1>

          <p
            className="
            text-lg
            text-center
            text-gray-200
            leading-relaxed
            "
          >
            Manage your products,
            track stock, monitor sales,
            and visualize inventory
            analytics in one dashboard.
          </p>

          <div
            className="
            mt-10
            text-7xl
            "
          >
            📦
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div
          className="
          p-8
          md:p-12
          bg-white
          dark:bg-gray-900
          "
        >

          <h2
            className="
            text-4xl
            font-bold
            text-gray-800
            mb-2
            "
          >
            Welcome Back
          </h2>

          <p
            className="
            text-gray-500
            mb-8
            "
          >
            Login to continue
          </p>

          <form onSubmit={handleSubmit}>

            {/* USERNAME */}

            <div className="mb-5">

              <label
                className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                "
              >
                Username
              </label>

              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
                className="
                w-full
                border
                border-gray-300
                p-4
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
                "
              />

            </div>

            {/* PASSWORD */}

            <div className="mb-6">

              <label
                className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                "
              >
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                  absolute
                  right-4
                  top-4
                  text-sm
                  text-blue-600
                  font-semibold
                  "
                >
                  {
                    showPassword
                      ? "Hide"
                      : "Show"
                  }
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-gradient-to-r
              from-blue-500
              to-blue-700
              text-white
              py-4
              rounded-xl
              font-semibold
              hover:scale-105
              hover:shadow-lg
              transition
              duration-300
              "
            >
              {
                loading
                  ? "Logging in..."
                  : "Login"
              }
            </button>

          </form>

          {/* REGISTER LINK */}

          <p
            className="
            text-center
            text-gray-500
            mt-6
            "
          >
            Don’t have an account?

            <a
              href="/register"
              className="
              text-blue-600
              font-semibold
              ml-1
              hover:underline
              "
            >
              Register
            </a>
          </p>

        </div>

      </div>
<ToastContainer position="top-right" />
    </div>
    
  );
}

export default Login;