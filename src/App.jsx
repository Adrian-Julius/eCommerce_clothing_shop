import { NavLink, Link, Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { cartProductsContext } from "./components/CartContext";

import logo from "/public/Images/logo-ecommerce.png";
// import { Icon } from "semantic-ui-react";

import "./App.css";

function App() {
  const {
    itemNum,
    settingCategory,
    setIsView,
    setIsChanging,
    isLogin,
    setIsLogin,
    handleSignout,
  } = useContext(cartProductsContext);
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate()

  // check if the user is login or not
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin]);

  function showingNav() {
    setIsActive(!isActive);
  }

  // CHANGING isActive to false when screen size is large(lg)
  useEffect(() => {
    function resizing() {
      const largeScreen = window.matchMedia("(min-width: 1024px)");

      if (largeScreen.matches) {
        setIsActive(false);
      }
    }

    // Add event listener for screen resizing
    window.addEventListener("resize", resizing);
    resizing();

    return () => {
      window.removeEventListener("resize", resizing);
    };
  }, []);

  return (
    <>
      <div className="container font-serif flex flex-col min-h-screen min-w-full">
        <header className="header sticky top-0 z-50 flex-shrink-0  flex justify-end items-center h-11 px-[30px] py-[40px] bg-slate-500">
          <div className="text-start text-4xl font-semibold w-screen text-green-500 ">
            <NavLink
              to={"/"}
              onClick={() => (setIsView(false), setIsChanging(false))}
            >
              <img
                src={logo}
                alt="website logo"
                className="w-[70px] p-0 float-start sm:w-[100px]"
              />
            </NavLink>
          </div>

          <button
            onClick={() => showingNav()}
            className="lg:hidden float-right text-3xl z-50 hover:text-gray-300 duration-700"
          >
            {isActive ? "✖️" : "🍔"}
          </button>

          <nav>
            <ul
              className={`${
                isActive
                  ? " w-full md:w-1/2 h-screen absolute top-0 right-0 flex flex-col justify-center items-center gap-y-[7vh] bg-transparent backdrop-blur-[5px] md:backdrop-blur-[15px] z-40"
                  : " hidden gap-x-2 lg:flex"
              }`}
            >
              <li>
                <NavLink
                  to={"/"}
                  onClick={() => (
                    setIsActive(false), setIsView(false), setIsChanging(false)
                  )}
                  className=" text-white font-semibold py-4 bg-slate-600 px-6 rounded-3xl shadow-lg hover:bg-orange-600 duration-200 hover:shadow-md"
                >
                  HOME
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={"about"}
                  onClick={() => (
                    setIsActive(false), setIsView(false), setIsChanging(false)
                  )}
                  className="text-white font-semibold py-4 bg-slate-600 px-6 rounded-3xl shadow-lg hover:bg-orange-600 duration-200 hover:shadow-md"
                >
                  ABOUT
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={"products"}
                  onClick={() => {
                    settingCategory("allItems");
                    setIsActive(false);
                    setIsView(false);
                    setIsChanging(false);
                  }}
                  className="text-white font-semibold py-4 bg-slate-600 px-6 rounded-3xl shadow-lg hover:bg-orange-600 duration-200 hover:shadow-md"
                >
                  SHOP
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={"contact"}
                  onClick={() => (
                    setIsActive(false), setIsView(false), setIsChanging(false)
                  )}
                  className="text-white font-semibold py-4 bg-slate-600 px-6 rounded-3xl shadow-lg hover:bg-orange-600 duration-200 hover:shadow-md"
                >
                  CONTACT
                </NavLink>
              </li>

              <li className="relative">
                <NavLink
                  to={"cart"}
                  onClick={() => (
                    setIsActive(false), setIsView(false), setIsChanging(false)
                  )}
                  className="text-white text-[18px] py-4 bg-slate-600 px-6 rounded-3xl shadow-lg hover:bg-orange-600 duration-200 hover:shadow-md"
                >
                  <span>🛒</span>
                </NavLink>
                <span
                  className={`${
                    itemNum == 0 ? "hidden" : "block"
                  } z-50 absolute top-[-20px] right-[-15px] text-lg text-center w-[30px] py-[2px] rounded-full text-black font-extrabold bg-slate-300 lg:bg-slate-100 cursor-pointer`}
                >
                  {itemNum}
                </span>
              </li>

              <li>
                <Link
                  to={isLogin ? "/" : "/login"}
                  onClick={() => {
                    {
                      isLogin
                        ? (setIsActive(false),
                          setIsView(false),
                          setIsChanging(false),
                          setIsLogin(false))
                        : handleSignout;
                    }
                  }}
                  className=" text-white font-semibold py-4 bg-slate-600 px-6 rounded-3xl shadow-lg hover:bg-orange-600 duration-200 hover:shadow-md"
                >
                  {isLogin ? "LOGOUT" : "LOGIN"}
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* CHILDREN COMPONENTS */}
        <div className="componentsContainer flex-1 px-[5vw] py-[4vh]">
          <Outlet />
        </div>

        {/* FOOTER */}
        <footer className="footerContainer flex-shrink-0 flex justify-center items-center w-full text-[13px] sm:text-xl text-center text-gray-100 p-[20px] bg-slate-500 h-[10vh] ">
          <h5>© 2025 Adrian Julius Villaruel. All rights reserved.</h5>
        </footer>
      </div>
    </>
  );
}

export default App;
