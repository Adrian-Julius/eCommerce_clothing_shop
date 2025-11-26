import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Products from "./components/Products.jsx";
import Contact from "./components/Contact.jsx";
import Cart from "./components/Cart.jsx";
import CartContext from "./components/CartContext.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

import Error from "./components/Error.jsx";

const myRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> }, //index: true     // render renders when the parent path matches exactly
        { path: "/about", element: <About /> },
        { path: "/products", element: <Products /> },
        { path: "/products/:id", element: <Products /> },
        { path: "/contact", element: <Contact /> },
        { path: "/cart", element: <Cart /> },
      ],
    },

    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
  ],
  {
    basename: "/eCommerce_clothing_shop/", // <-- set basename here
  }
);

createRoot(document.getElementById("root")).render(
  <CartContext>
    <RouterProvider router={myRouter} />
  </CartContext>
);
