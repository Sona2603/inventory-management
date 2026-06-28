import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {


      toast.error("Passwords do not match");

      return;
    }

    setLoading(true);

    try {

      await axios.post(
        "https://inventory-management-8qsw.onrender.com/api/users/register/",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      toast.success("Registration Successful");

      window.location.href = "/login";

    } catch (error) {

      console.error(error);

      toast.error("Registration Failed");

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
      via-green-900
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
          from-green-600/30
          to-blue-600/30
          "
        >

          <h1 className="text-5xl font-bold mb-6">
            Join Us
          </h1>

          <p
            className="
            text-lg
            text-center
            text-gray-200
            leading-relaxed
            "
          >
            Create your account and
            start managing products,
            stock, and sales with
            a modern inventory dashboard.
          </p>

          <div
            className="
            mt-10
            text-7xl
            "
          >
            🚀
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
            Create Account
          </h2>

          <p
            className="
            text-gray-500
            mb-8
            "
          >
            Register to continue
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
                focus:ring-green-500
                transition
                "
              />

            </div>

            {/* PASSWORD */}

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
                  focus:ring-green-500
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
                  text-green-600
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

            {/* CONFIRM PASSWORD */}

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
                Confirm Password
              </label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
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
                focus:ring-green-500
                transition
                "
              />

              

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-gradient-to-r
              from-green-500
              to-green-700
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
                  ? "Creating Account..."
                  : "Register"
              }
            </button>

          </form>

          {/* LOGIN LINK */}

          <p
            className="
            text-center
            text-gray-500
            mt-6
            "
          >
            Already have an account?

            <a
              href="/login"
              className="
              text-green-600
              font-semibold
              ml-1
              hover:underline
              "
            >
              Login
            </a>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;