import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// IMPORT VARIABLES
import { cartProductsContext } from "./CartContext";

const Products = () => {
  const navigate = useNavigate();

  const {
    category,
    settingCategory,
    allProducts,
    settingAddToCart,
    isView,
    setIsView,
    isChanging,
    setIsChanging,
    currItem,
    setCurrItem,
    setSize,
    updatingAddToCart,

    isLogin,
    setIslogin,
  } = useContext(cartProductsContext);

  // ALL ITEMS COMPONENT
  const [page, setPage] = useState(1);
  const [currSize, setCurrSize] = useState("");
  const [currQuantity, setCurrQuantity] = useState(1);
  const [currTotal, setCurrTotal] = useState(currItem?.price);

  const allItems = [
    ...allProducts.hoodies,
    ...allProducts.tshirts,
    ...allProducts.jackets,
    ...allProducts.poloshirts,
  ];

  //SETTING PAGES FUNCTION
  function settingPages(inputted) {
    setPage(inputted);
  }

  // INITIALIZING THE PAGES
  const pages = (
    <div className="flex flex-wrap justify-center w-full">
      {[
        ...Array(
          Math.ceil(
            (category === "allItems" ? allItems : allProducts[category])
              .length / 6
          )
        ),
      ].map((item, index) => (
        <button
          key={index}
          onClick={() => settingPages(index + 1)}
          className={`${
            page === index + 1
              ? "bg-orange-600 text-white"
              : " bg-slate-200 text-black"
          } text-lg sm:text-xl font-semibold px-6 py-3 m-2 rounded-2xl shadow-lg hover:text-white duration-200 hover:shadow-md`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  // INITIALIZING THE DISPLAYED ITEMS using slice() and map()
  const displayedItems = (
    category === "allItems" ? allItems : allProducts[category]
  )
    .slice(page * 6 - 6, page * 6)
    .map((item, index) => (
      <div
        key={index}
        className="itemContainer flex-shrink-0 flex flex-col justify-between w-[200px] md:w-[350px] sm:h-auto p-2 md:p-4 text-[12px] md:text-lg rounded-xl bg-gray-200 hover:bg-gray-300 duration-500"
      >
        <img
          src={item.productImg}
          alt=""
          className="w-full h-4/5 object-cover"
        />
        <div className="mt-2 py-2">
          {" "}
          <h3 className="">{item.name}</h3>
          <p>PHP {item.price}</p>
          <p>
            Rate: {item.rate}/5 ⭐({item.review}k)
          </p>
          <Link
            to={`/products/${item.product_id}`}
            onClick={() => {
              setCurrItem(item);
              setIsView(true);
              setCurrTotal(item.price);
            }}
            className="inline-block px-3 py-1 mt-1 md:mt-3 border-[2px] border-[tomato] rounded-3xl hover:bg-[tomato] hover:text-white duration-300"
          >
            View Product
          </Link>
        </div>
      </div>
    ));

  const sizeOptions = ["xs", "s", "m", "L", "xl", "2xl", "3xl"];

  useEffect(() => {
    if (isView && isChanging && currItem) {
      setCurrSize(currItem.size);
      setCurrQuantity(currItem.quantity || 1);
      setCurrTotal(currItem.total || currItem.price);
    } else if (isView && !isChanging && currItem) {
      setCurrSize("");
      setCurrQuantity(1);
      setCurrTotal(currItem.price);
    }
  }, [isView, isChanging, currItem]);

  // Monitor curTotal
  useEffect(() => {
    setCurrTotal(currItem?.price * currQuantity);
  }, [currQuantity]);

  return (
    <>
      {isView ? (
        // (VIEW PRODUCT)
        <div className="border-orange-600 w-full h-full bg-transparent backdrop-blur-[5px] md:backdrop-blur-[15px] z-50 ">
          <div className="absolute top-[-15px] right-[-15px]">
            {" "}
            <button
              className="text-3xl z-50"
              onClick={() => {
                setIsView(false);
                setIsChanging(false);
                navigate("/products");
              }}
            >
              ✖️
            </button>
          </div>

          <div
            key={
              isChanging ? currItem?.products?.product_id : currItem?.product_id
            }
            className=" flex-shrink-0 flex flex-col sm:flex-row justify-start gap-3 md:gap-10 sm:h-auto p-2 md:p-4 rounded-xl bg-gray-200 hover:bg-gray-300 duration-500"
          >
            <img
              src={
                isChanging
                  ? currItem?.products?.productImg
                  : currItem?.productImg
              }
              alt=""
              className="w-[200px] mt-2 md:w-[300px] lg:w-[350px] m-auto"
            />
            <div className="flex flex-col justify-between m-2 p-2 text-[15px] lg:text-lg">
              {" "}
              <h3 className="text-[18px] md:text-2xl lg:text-3xl">
                <span className="font-extrabold text-[15px] md:text-xl lg:text-2xl">
                  Product:
                </span>{" "}
                {isChanging ? currItem?.products?.name : currItem?.name}
              </h3>
              <p>
                <span className="font-extrabold">Price:</span> PHP{" "}
                {isChanging ? currItem?.products?.price : currItem?.price}
              </p>
              <p>
                <span className="font-extrabold">Rate:</span>{" "}
                {isChanging ? currItem?.products?.rate : currItem?.rate}
                /5 ⭐(
                {isChanging ? currItem?.products?.review : currItem?.review}
                k)
              </p>
              {/* sizes */}
              <div className="sizesContainer">
                <h3 className="font-extrabold">Sizes:</h3>
                {sizeOptions.map((sizeOption, index) => (
                  <button
                    key={index}
                    className={`sizes px-3 py-2 m-[5px] border-[2px] border-[black] rounded-xl ${
                      currSize === sizeOption
                        ? "bg-[tomato] text-white duration-300"
                        : "bg-none"
                    }`}
                    onClick={() => {
                      setCurrSize(sizeOption);
                    }}
                  >
                    {sizeOption}
                  </button>
                ))}

                {/* Quantities */}
                <h3 className="font-extrabold mt-2">Quantities:</h3>
                <span className="block text-lg md:text-xl mt-2">
                  <button
                    onClick={() =>
                      setCurrQuantity(currQuantity === 1 ? 1 : currQuantity - 1)
                    }
                    className="px-4 py-1 sm:px-4 sm:py-1 text-[15px] md:text-lg rounded-lg bg-slate-200 hover:bg-orange-600 hover:text- hite duration-200"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={currQuantity}
                    readOnly
                    className="w-20 text-center text-[15px] md:text-xl rounded-lg p-1 mx-2"
                  />
                  <button
                    onClick={() => setCurrQuantity(currQuantity + 1)}
                    className="px-4 py-1 sm:px-4 sm:py-1 text-[15px] md:text-lg rounded-lg bg-slate-200 hover:bg-orange-600 hover:text-white duration-200 "
                  >
                    +
                  </button>
                </span>
              </div>
              {/* product description */}
              <h3 className="font-extrabold">Description:</h3>
              <p className="text-justify">
                {isChanging
                  ? currItem?.products?.description
                  : currItem?.description}
              </p>
              {/* TOTAL */}
              <p>
                <span className="font-extrabold text-orange-600">Total:</span>{" "}
                PHP {isChanging ? currItem?.total.toFixed(2) : currTotal?.toFixed(2)}
              </p>
              <div>
                {" "}
                {isChanging ? (
                  // {/* Update the item button */}

                  <button
                    className="px-3 py-1 my-1 md:my-3 border-[2px] border-[tomato] rounded-3xl hover:bg-[tomato] hover:text-white duration-300"
                    onClick={() => {
                      updatingAddToCart(currItem, currQuantity, currSize, currTotal);
                      setSize(currSize);
                      navigate("/cart");
                    }}
                  >
                    UPDATE THE PRODUCT
                  </button>
                ) : (
                  // {/* Add to cart button */}
                  <button
                    className="px-3 py-1 my-1 md:my-3 border-[2px] border-[tomato] rounded-3xl hover:bg-[tomato] hover:text-white duration-300"
                    onClick={() => {
                      isLogin
                        ? currSize !== ""
                          ? (settingAddToCart(currItem, currQuantity, currSize),
                            setSize(currSize))
                          : alert("Please pick your size first!")
                        : alert(
                            "YOU NEED TO LOGIN FIRST IN ORDER TO ADD TO CART!"
                          );
                    }}
                  >
                    ADD TO CART
                  </button>
                )}
                <br />
                <Link
                  to={"/cart"}
                  className="block px-3 py-1 my-1 underline underline-offset-4 rounded-xl hover:text-orange-500 duration-300"
                >
                  View Cart 🛒
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // IF NOT VIEW PRODUCT, SHOW PRODUCTS LIST
        <div className="productContainer text-center">
          <div className="md:text-xl text-left mb-10">
            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-[1em] sm:gap-[1em]">
              <li>
                <button
                  className={`${
                    category == "allItems"
                      ? "bg-orange-600 text-white"
                      : "text-black bg-slate-200 "
                  } font-semibold px-6 py-4  shadow-lg rounded-3xl hover:text-white duration-200 hover:shadow-md`}
                  onClick={() => {
                    settingCategory("allItems");
                    settingPages(1);
                  }}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className={`${
                    category == "hoodies"
                      ? "bg-orange-600 text-white"
                      : "text-black bg-slate-200 "
                  } font-semibold px-6 py-4  shadow-lg rounded-3xl hover:text-white duration-200 hover:shadow-md`}
                  onClick={() => {
                    settingCategory("hoodies");
                    settingPages(1);
                  }}
                >
                  Hoodies
                </button>
              </li>
              <li>
                <button
                  className={`${
                    category == "jackets"
                      ? "bg-orange-600 text-white"
                      : "text-black bg-slate-200 "
                  } font-semibold px-6 py-4  shadow-lg rounded-3xl hover:text-white duration-200 hover:shadow-md`}
                  onClick={() => {
                    settingCategory("jackets");
                    settingPages(1);
                  }}
                >
                  Jackets
                </button>
              </li>
              <li>
                <button
                  className={`${
                    category == "tshirts"
                      ? "bg-orange-600 text-white"
                      : "text-black bg-slate-200 "
                  } font-semibold px-6 py-4  shadow-lg rounded-3xl hover:text-white duration-200 hover:shadow-md`}
                  onClick={() => {
                    settingCategory("tshirts");
                    settingPages(1);
                  }}
                >
                  T-Shirts
                </button>
              </li>
              <li>
                <button
                  className={`${
                    category == "poloshirts"
                      ? "bg-orange-600 text-white"
                      : "text-black bg-slate-200 "
                  } font-semibold px-6 py-4  shadow-lg rounded-3xl hover:text-white duration-200 hover:shadow-md`}
                  onClick={() => {
                    settingCategory("poloshirts");
                    settingPages(1);
                  }}
                >
                  Polo Shirts
                </button>
              </li>
            </ul>
          </div>

          {/* CHILD COMPONENTS OF PRODUCTS.JSX */}
          <main className="flex flex-wrap gap-8 justify-center">
            {displayedItems}
            {pages}
          </main>
        </div>
      )}
    </>
  );
};

export default Products;
