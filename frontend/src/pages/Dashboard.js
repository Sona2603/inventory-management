import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import {
  ToastContainer,
  toast,
} from "react-toastify";

import { useNavigate } from "react-router-dom";



import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Dashboard() {

  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [sellQuantity, setSellQuantity] = useState("");
const [sellProduct, setSellProduct] = useState(null);
const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOption, setSortOption] = useState("");

  const [editId, setEditId] = useState(null);

const [formData, setFormData] = useState({
  name: "",
  quantity: "",
  price: "",
  description: "",
  category: "",
  image: null,
  preview: "",
});

const [currentPage, setCurrentPage] = useState(1);
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);
const formRef = useRef(null);

const productsPerPage = 6;

  // =========================
  // DASHBOARD CALCULATIONS
  // =========================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.quantity),
    0
  );

  const totalInventoryValue = products.reduce(
  (sum, product) =>
    sum + Number(product.price) * Number(product.quantity),
  0
);

  const lowStockProducts = products.filter(
    (product) => Number(product.quantity) < 5
  ).length;

 

  const categoryData = [];

products.forEach((product) => {

  const existingCategory = categoryData.find(
    (item) => item.name === product.category
  );

  if (existingCategory) {

    existingCategory.value += 1;

  } else {

    categoryData.push({
      name: product.category || "Unknown",
      value: 1,
    });
  }
});

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

  // =========================
  // SEARCH FILTER
  // =========================


const sortedProducts = [...products].sort(
  (a, b) => {

    if (sortOption === "price-low") {
      return a.price - b.price;
    }

    if (sortOption === "price-high") {
      return b.price - a.price;
    }

    if (sortOption === "quantity") {
      return b.quantity - a.quantity;
    }

    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
  }
);

const indexOfLastProduct = currentPage * productsPerPage;

const indexOfFirstProduct =
  indexOfLastProduct - productsPerPage;

const currentProducts =
  sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

const totalPages = Math.ceil(
  sortedProducts.length / productsPerPage
);

  // =========================
  // FETCH PRODUCTS
  // =========================

useEffect(() => {

  fetchProducts();
  fetchHistory();

// eslint-disable-next-line
}, [searchTerm]);

  useEffect(() => {

  if (darkMode) {

    document.documentElement.classList.add("dark");

    localStorage.setItem("theme", "dark");

  } else {

    document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", "light");
  }

}, [darkMode]);

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, sortOption]);

  const fetchProducts = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
  `https://inventory-management-8qsw.onrender.com/api/products/?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data);

    } catch (error) {

      console.error(error);
      toast.error("Failed to fetch products");

    } finally {

      setLoading(false);
    }
  };

  const fetchHistory = async () => {

  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://inventory-management-8qsw.onrender.com/api/stock-history/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setHistory(response.data);

  } catch (error) {

    console.error(error);
  }
};

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {

      const file = files[0];

      setFormData({
        ...formData,
        image: file,
        preview: file
          ? URL.createObjectURL(file)
          : "",
      });

    } else {

      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  // =========================
  // ADD / UPDATE PRODUCT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSubmitting(true);

    console.log("EDIT ID:", editId);

    try {

      const data = new FormData();

      data.append("name", formData.name);
      data.append("quantity", formData.quantity);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = localStorage.getItem("token");

      if (
  !formData.name ||
  !formData.price ||
  !formData.quantity ||
  !formData.category
) {
  toast.error("Please fill all required fields");
  return;
}

if (Number(formData.price) <= 0) {
  toast.error("Price must be greater than 0");
  return;
}

if (Number(formData.quantity) < 0) {
  toast.error("Quantity cannot be negative");
  return;
}

      // =========================
      // UPDATE
      // =========================

      if (editId) {

        await axios.put(
          `https://inventory-management-8qsw.onrender.com/api/products/update/${editId}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Product updated successfully!");

      }

      // =========================
      // CREATE
      // =========================

      else {

        await axios.post(
          "https://inventory-management-8qsw.onrender.com/api/products/",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Product added successfully!");
      }

      // REFRESH PRODUCTS
      await fetchProducts();
      await fetchHistory();

      // RESET FORM
      setFormData({
        name: "",
        quantity: "",
        price: "",
        description: "",
        category: "",
        image: null,
        preview: "",
      });

      setEditId(null);

    } catch (error) {

      console.error(error);

      

      toast.error("Something went wrong!");
    }finally {

  setSubmitting(false);
}
  };


  // =========================
  // DELETE PRODUCT
  // =========================

   const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
  "Are you sure you want to delete this product?"
);

if (!confirmDelete) return;
    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://inventory-management-8qsw.onrender.com/api/products/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted");

      fetchProducts();
      fetchHistory();

    } catch (error) {

      console.error(error);
      toast.error("Delete failed");
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEdit = (product) => {


    setSelectedProduct(null);

    // IMPORTANT
    setEditId(product.id);
    formRef.current?.scrollIntoView({
  behavior: "smooth",
  block: "start",
});

    setFormData({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      description: product.description || "",
      category: product.category || "",
      image: null,
      preview: product.image
        ? product.image
        : "",
    });
  };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};


const handleSell = (product) => {
  setSellProduct(product);
  setSellQuantity("");
};

const submitSell = async () => {

  if (!sellQuantity || sellQuantity <= 0) {

    toast.error("Enter valid quantity");

    return;
  }

  if (sellQuantity > sellProduct.quantity) {

    toast.error("Not enough stock");

    return;
  }

  try {

    const data = new FormData();

    data.append("quantity", sellQuantity);

    await axios.post(
      `https://inventory-management-8qsw.onrender.com/api/products/sell/${sellProduct.id}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Product sold!");

    setSellProduct(null);

    fetchProducts();

    fetchHistory();

  } catch (error) {

    console.error(error);

    toast.error("Something went wrong");
  }
};
  return (

    <div className="min-h-screen relative bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-black p-10 transition-all duration-300">

      {/* HEADER */}

      <div className="
bg-white
dark:bg-gray-800
shadow-md
rounded-xl
p-5
mb-10
flex
justify-between
items-center
">

        <div>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Inventory Management System
          </h1>

          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Welcome back
          </p>

        </div>

        <div className="flex gap-3">

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="bg-black text-white px-5 py-2 rounded-lg"
  >
    {darkMode ? "Light Mode" : "Dark Mode"}
  </button>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
  >
    Logout
  </button>

</div>

      </div>

      {/* DASHBOARD CARDS */}

      <div className="grid md:grid-cols-4 gap-8 mb-10">

        <div className="
bg-gradient-to-r
from-blue-500
to-blue-700
text-white
p-6
rounded-2xl
shadow-lg
hover:scale-105
hover:shadow-blue-500/50
transition
transform
hover:-translate-y-2
hover:scale-105
duration-300
">

          <h2 className="text-3xl font-bold">
            {totalProducts}
          </h2>

          <p className="mt-2">
            Total Products
          </p>

        </div>

        <div
    className="
    bg-gradient-to-r
    from-green-500
    to-green-700
    text-white
    p-6
    rounded-2xl
    shadow-lg
    hover:scale-105
    hover:shadow-green-500/50
    transition
    duration-300
    transform
hover:-translate-y-2
hover:scale-105

    "
  >

          <h2 className="text-3xl font-bold">
            {totalStock}
          </h2>

          <p className="mt-2">
            Total Stock
          </p>

        </div>

         <div
    className="
    bg-gradient-to-r
    from-red-500
    to-red-700
    text-white
    p-6
    rounded-2xl
    shadow-lg
    hover:scale-105
    hover:shadow-red-500/50
    transition
    transform
hover:-translate-y-2
hover:scale-105
duration-300
    "
  >

          <h2 className="text-3xl font-bold">
            {lowStockProducts}
          </h2>

          <p className="mt-2">
            Low Stock Items
          </p>

        </div>
<div
  className="
  bg-gradient-to-r
  from-purple-500
  to-purple-700
  text-white
  p-6
  rounded-2xl
  shadow-lg
  hover:scale-105
  hover:shadow-purple-500/50
  transition
  transform
hover:-translate-y-2
hover:scale-105
duration-300
  "
>

  <h2 className="text-3xl font-bold">
    ₹{totalInventoryValue.toLocaleString("en-IN")}
  </h2>

  <p className="mt-2">
    Total Inventory Value
  </p>

</div>

      </div>
      

      {/* SEARCH + CSV */}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
w-full
md:w-1/2
border
dark:border-gray-700
p-3
rounded-lg
shadow-sm
bg-white
dark:bg-gray-800
text-black
dark:text-white
placeholder-gray-500
dark:placeholder-gray-400
focus:outline-none
focus:ring-2
focus:ring-blue-500
transition
"
        />

        <select
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}
  className="
  border
  dark:border-gray-700
  p-3
  rounded-lg
  bg-white
  dark:bg-gray-800
  text-black
  dark:text-white
  "
>

  <option value="">
    Sort By
  </option>

  <option value="price-low">
    Price: Low to High
  </option>

  <option value="price-high">
    Price: High to Low
  </option>

  <option value="quantity">
    Quantity
  </option>

  <option value="name">
    Name A-Z
  </option>

</select>

        <CSVLink
          data={products}
          filename={"inventory-data.csv"}
          className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Export CSV
        </CSVLink>

      </div>

      {/* CHART */}

      <div className="
bg-white
dark:bg-gray-800
p-6
rounded-2xl
shadow-xl
mb-8
">

        <h2 className="
text-2xl
font-bold
mb-4
text-gray-800
dark:text-white
">
          Inventory Stock Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={products}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="quantity"
              fill="#3B82F6"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* PIE CHART */}

<div
  className="
  bg-white
  dark:bg-gray-800
  p-6
  rounded-2xl
  shadow-xl
  mb-8
  "
>

  <h2
    className="
    text-2xl
    font-bold
    mb-6
    text-gray-800
    dark:text-white
    "
  >
    Products by Category
  </h2>

  <ResponsiveContainer width="100%" height={350}>

    <PieChart>

      <Pie
        data={categoryData}
        cx="50%"
        cy="50%"
        outerRadius={120}
        dataKey="value"
        label
      >

        {
          categoryData.map((entry, index) => (

            <Cell
              key={`cell-${index}`}
              fill={
                COLORS[index % COLORS.length]
              }
            />

          ))
        }

      </Pie>

      <Tooltip />

      <Legend />

    </PieChart>

  </ResponsiveContainer>

</div>

<div className="
bg-white
dark:bg-gray-800
p-6
rounded-2xl
shadow-xl
mb-8
">

  <h2 className="
  text-2xl
  font-bold
  mb-6
  text-gray-800
  dark:text-white
  ">
    Recent Activity
  </h2>

  <div className="space-y-4">

    {
      history.slice(0, 5).map((item) => (

        <div
          key={item.id}
          className="
          flex
          justify-between
          items-center
          border-b
          dark:border-gray-700
          pb-3
          "
        >

          <div>

            <p className="
            font-semibold
            text-gray-800
            dark:text-white
            ">
              {item.product_name}
            </p>

            <p className="
            text-sm
            text-gray-500
            dark:text-gray-400
            ">
              Quantity: {item.quantity}
            </p>

          </div>

          <span className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold

            ${
              item.action === "CREATED"
                ? "bg-green-100 text-green-700"

              : item.action === "UPDATED"
                ? "bg-yellow-100 text-yellow-700"

              : item.action === "SOLD"
? "bg-blue-100 text-blue-700"
: "bg-red-100 text-red-700"
            }
          `}>

            {item.action}

          </span>

        </div>
      ))
    }

  </div>

</div>

      {/* PRODUCT FORM */}

      <div
  ref={formRef}
  className="
bg-white
dark:bg-gray-800
p-6
rounded-2xl
shadow-xl
mb-8
max-w-xl
mx-auto
transition
">

        <h2 className="
text-2xl
font-bold
mb-6
text-center
text-gray-800
dark:text-white
">

          {editId ? "Edit Product" : "Add Product"}

        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="
w-full
border
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-900
text-black
dark:text-white
p-3
rounded-xl
mb-4
focus:outline-none
focus:ring-2
focus:ring-blue-500
dark:[color-scheme:dark]
transition
"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="
w-full
border
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-900
text-black
dark:text-white
dark:[color-scheme:dark]
p-3
rounded-xl
mb-4
focus:outline-none
focus:ring-2
focus:ring-blue-500
transition
"
          />
         

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="
w-full
border
border-gray-300
dark:[color-scheme:dark]
dark:border-gray-700
bg-white
dark:bg-gray-900
text-black
dark:text-white
p-3
rounded-xl
mb-4
focus:outline-none
focus:ring-2
focus:ring-blue-500
transition
"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
           className="
w-full
border
dark:[color-scheme:dark]
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-900
text-black
dark:text-white
p-3
rounded-xl
mb-4
focus:outline-none
focus:ring-2
focus:ring-blue-500
transition
"
          />

          <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="
w-full
border
border-gray-300
dark:border-gray-700
bg-white
dark:bg-gray-900
text-black
dark:text-white
p-3
dark:[color-scheme:dark]
rounded-xl
mb-4
focus:outline-none
focus:ring-2
focus:ring-blue-500
transition
"
>

  <option value="">
    Select Category
  </option>

  <option value="Electronics">
    Electronics
  </option>

  <option value="Accessories">
    Accessories
  </option>

  <option value="Furniture">
    Furniture
  </option>

</select>

         <input
  type="file"
  name="image"
  accept="image/*"
  onChange={(e) => {

  const file = e.target.files[0];

  setFormData({
    ...formData,
    image: file,
    preview: file
      ? URL.createObjectURL(file)
      : "",
  });
}}
  className="
w-full
border
border-dashed
border-gray-400
dark:border-gray-600
bg-gray-50
dark:bg-gray-900
text-black
dark:text-white
p-3
rounded-xl
mb-4
cursor-pointer
"
/>

{
  formData.preview && (
    <img
      src={formData.preview}
      alt="Preview"
      className="w-full h-48 object-contain rounded mb-4"
    />
  )
}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition w-full"
          >
            {
  submitting
    ? "Saving..."
    : editId
    ? "Update Product"
    : "Add Product"
}
          </button>

          {
  editId && (
    <button
      type="button"
      onClick={() => {

        setEditId(null);

        setFormData({
          name: "",
          quantity: "",
          price: "",
          description: "",
          category: "",
          image: null,
          preview: "",
        });
      }}
      className="
      bg-gray-500
      text-white
      px-6
      py-3
      rounded
      w-full
      mt-3
      hover:bg-gray-600
      transition
      "
    >
      Cancel Edit
    </button>
  )
}

        </form>

      </div>

      {
  lowStockProducts > 0 && (

    <div
      className="
      bg-red-100
      dark:bg-red-900/30
      border
      border-red-400
      text-red-700
      dark:text-red-300
      px-6
      py-4
      rounded-xl
      mb-8
      font-semibold
      "
    >

      ⚠ Warning:
      {lowStockProducts} low stock items detected.

    </div>
  )
}

{
  loading && (

    <div className="flex justify-center mb-6">

  <div className="
    w-12
    h-12
    border-4
    border-blue-500
    border-t-transparent
    rounded-full
    animate-spin
  "></div>

</div>
  )
}
      {/* PRODUCT CARDS */}

      <div className="grid md:grid-cols-3 gap-6">

        {currentProducts.map((product) => (

          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="
bg-white
dark:bg-gray-800
p-5
rounded-2xl
shadow-lg
hover:shadow-2xl
hover:-translate-y-2
transition
duration-300
flex
flex-col
justify-between
border
border-transparent
hover:border-blue-500
cursor-pointer
"
          >

            {/* IMAGE */}

          <div className="w-full h-48 mb-4">

  {
    product.image ? (

      <img
        src={product.image}
        alt={product.name}
        className="
w-full
h-full
object-cover
rounded-xl
group-hover:scale-105
transition
duration-300
"
      />

    ) : (

      <div className="
w-full
h-full
bg-gray-200
dark:bg-gray-700
rounded-xl
flex
items-center
justify-center
text-gray-500
dark:text-gray-300
">

        No Image

      </div>

    )
  }

</div>

            {/* PRODUCT DETAILS */}

            <h2 className="
text-2xl
font-semibold
mb-2
text-gray-800
dark:text-white
">
              {product.name}
            </h2>
            <p className="
text-sm
font-semibold
mb-3
inline-block
bg-blue-100
dark:bg-blue-900
text-blue-700
dark:text-blue-300
px-3
py-1
rounded-full
w-fit
">
  {product.category}
</p>

            <p className="
mb-2
text-gray-700
dark:text-gray-300
">
              Quantity: {product.quantity}
            </p>

            {
  product.quantity === 0 ? (

    <p className="
    text-red-500
    font-bold
    mb-3
    bg-red-100
    dark:bg-red-900/40
    dark:text-red-300
    px-3
    py-2
    rounded-lg
    text-sm
    ">
      🔴 Out of Stock
    </p>

  ) : product.quantity <= 5 ? (

    <p className="
    text-orange-500
    font-bold
    mb-3
    bg-orange-100
    dark:bg-orange-900/40
    dark:text-orange-300
    px-3
    py-2
    rounded-lg
    text-sm
    ">
      🟠 Low Stock
    </p>

  ) : (

    <p className="
    text-green-600
    font-bold
    mb-3
    bg-green-100
    dark:bg-green-900/40
    dark:text-green-300
    px-3
    py-2
    rounded-lg
    text-sm
    ">
      🟢 In Stock
    </p>

  )
}

           <p className="
mb-3
text-xl
font-bold
text-green-600
dark:text-green-400
">
  ₹{product.price}
</p>
             
           <p className="
text-gray-600
dark:text-gray-300
mb-4
line-clamp-3
">
              {product.description}
            </p>

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                onClick={(e) =>{ 
                  e.stopPropagation();
                  handleEdit(product)}}
                className="
bg-yellow-500
text-white
px-4
py-2
rounded-xl
hover:bg-yellow-600
transition
w-full
font-semibold
shadow-md
"
              >
                Edit
              </button>

              <button
                onClick={(e) =>{
                  e.stopPropagation();
                   handleDelete(product.id)}}
                className="
bg-red-500
text-white
px-4
py-2
rounded-xl
hover:bg-red-600
transition
w-full
font-semibold
shadow-md
"
              >
                Delete
              </button>

              <button
  onClick={(e) => {
    e.stopPropagation();
    handleSell(product);
  }}
  className="
  bg-green-600
  text-white
  px-4
py-2
rounded-xl
hover:bg-green-700
transition
w-full
font-semibold
shadow-md
  "
>
  Sell
</button>

            </div>

          </div>

        ))}

        {
          products.length === 0 && (

            <p className="
text-center
text-gray-500
dark:text-gray-300
col-span-3
">
              No products found. Add your first inventory item.
            </p>
          )
        }

      </div>
      <div className="flex justify-center gap-3 mt-10">

  {
    [...Array(totalPages)].map((_, index) => (

      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`
px-4
py-2
rounded-xl
font-semibold
transition
duration-300
${
  currentPage === index + 1
    ? "bg-blue-600 text-white shadow-lg"
    : "bg-white dark:bg-gray-800 dark:text-white"
}
`}
      >
        {index + 1}
      </button>

    ))
  }

</div>
{
  selectedProduct && (
     
    <div  onClick={() => setSelectedProduct(null)} 
    className="
    fixed
    inset-0
    bg-black/50
    flex
    justify-center
    items-center
    z-[999]
    overflow-y-auto
  p-4
    ">

      <div onClick={(e) => e.stopPropagation()}
      className="
      bg-white
      dark:bg-gray-800
      p-6
      rounded-2xl
      w-[90%]
      max-w-lg
      shadow-2xl
      relative
      ">

        <button
          onClick={() => setSelectedProduct(null)}
          className="
          absolute
          top-3
          right-3
          text-red-500
          text-xl
          font-bold
          "
        >
          ✕
        </button>

        {
  selectedProduct.image && (
    <img
      src={selectedProduct.image}
      alt={selectedProduct.name}
      className="
      w-full
      h-64
      object-cover
      rounded-xl
      mb-4
      "
    />
  )
}

        <h2 className="
        text-3xl
        font-bold
        mb-4
        text-gray-800
        dark:text-white
        ">
          {selectedProduct.name}
        </h2>

        <p className="
        text-gray-600
        dark:text-gray-300
        mb-3
        ">
          {selectedProduct.description || "No description"}
        </p>

        <p className="
        text-lg
        font-semibold
        mb-2
        dark:text-white
        ">
          Category:
          {selectedProduct.category}
        </p>

        <p className="
        text-lg
        font-semibold
        mb-2
        dark:text-white
        ">
          Quantity:
          {selectedProduct.quantity}
        </p>

        <p className="
        text-2xl
        font-bold
        text-green-600
        ">
          ₹{selectedProduct.price}
        </p>

      </div>

    </div>
  )
}

{
  sellProduct && (

    <div
      className="
      fixed
      inset-0
      bg-black/50
      flex
      justify-center
      items-center
      z-[999]
      "
    >

      <div
        className="
        bg-white
        dark:bg-gray-800
        p-6
        rounded-2xl
        w-[90%]
        max-w-md
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-4
          dark:text-white
          "
        >
          Sell Product
        </h2>

        <p className="mb-4 dark:text-white">
          Available Stock:
          {sellProduct.quantity}
        </p>

        <input
          type="number"
          placeholder="Enter quantity"
          value={sellQuantity}
          onChange={(e) =>
            setSellQuantity(e.target.value)
          }
          className="
          w-full
          border
          p-3
          rounded-xl
          mb-4
          dark:bg-gray-900
          dark:text-white
          "
        />

        <div className="flex gap-3">

          <button
            onClick={submitSell}
            className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded-xl
            w-full
            "
          >
            Confirm Sale
          </button>

          <button
            onClick={() => setSellProduct(null)}
            className="
            bg-gray-400
            text-white
            px-4
            py-2
            rounded-xl
            w-full
            "
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  )
}
<ToastContainer position="top-right" />

<footer className="
text-center
text-gray-500
dark:text-gray-400
mt-16
pb-6
">
  Built using React, Django REST Framework & Tailwind CSS
</footer>

    </div>
  );
}

export default Dashboard;