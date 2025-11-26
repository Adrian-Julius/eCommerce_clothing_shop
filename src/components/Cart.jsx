import { useContext, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { cartProductsContext } from "./CartContext";

const Cart = () => {
  // IMPORTED VARIABLE
  const {
    addToCart,
    quantities,
    settingQuantities,
    removingItem,
    handleCheckout,
    handleCheckoutAll,
    total,
    setCurrItem,
    setIsView,
    setIsChanging,
    currUsername,
  } = useContext(cartProductsContext);

  function handleProduct(product, index) {
    const itemQuantity = product.quantity;
    const itemTotal = product.price * itemQuantity;

    setIsView(true);
    setIsChanging(true);
    setCurrItem(product);
  }

  const [finalTotal, setFinalTotal] = useState(0);

  // function for calculating overall total of products
  const calculateFinalTotal = () => {
    if (!addToCart) return 0;

    const total = addToCart.reduce((acc, item) => {
      const price = item.products?.price || 0;
      const qty = item.quantity || 1;

      return acc + price * qty;
    }, 0);

    return total;
  };

  useEffect(() => {
    setFinalTotal(calculateFinalTotal());
  }, [addToCart, quantities]);

  return (
    <div className="cartContainer text-center px-3">
      <h1 className="font-semibold text-3xl md:text-5xl mb-3">SHOPPING CART</h1>
      <p className="font-semibold text-lg mb-9">User: {currUsername}</p>
      <div>
        <div className="text-xl sm:text-2xl text-orange-500 font-bold mb-5">
          Total: PHP {finalTotal.toFixed(2) ?? 0.0}
          <br />
          {/* CHECKOUT ALL */}
          {total > 0 && (
            <button
              onClick={() => handleCheckoutAll()}
              className=" px-5 py-2 mt-3 text-[15px] sm:text-lg rounded-2xl bg-orange-600 text-white duration-200 "
            >
              Checkout All
            </button>
          )}
        </div>

        {/* ADDED PRODUCTS */}
        <div>
          <ul className="text-center">
            {addToCart?.length > 0 ? (
              <>
                {/* Headers for Quantity, Products, and Prices */}
                {/* Map through products */}
                {addToCart.map((product, index) => (
                  <li
                    key={index}
                    className=" sm:w-4/5 mx-auto h-auto p-2 my-2 border-black border-[3px] rounded-lg"
                  >
                    {/* Product image and name */}
                    <div className="hidden sm:block float-left w-[130px] h-full mr-10 text-center border-black border-r-2">
                      <img
                        src={product.products.productImg}
                        alt="product Image"
                        className="w-full h-[170px]"
                      />
                    </div>

                    <div className="text-center">
                      <span className="block py-3 text-[15px] md:text-xl font-semibold text-orange-600 underline underline-offset-8">
                        <Link
                          to={`/products/${product.product_id}`}
                          onClick={() => {
                            handleProduct(product, index);
                          }}
                          title="Click to change size"
                          className="inline-block px-3 py-1 mt-1 md:mt-3 rounded-3xl hover:bg-[tomato] hover:text-white duration-300"
                        >
                          {product.products.name}{" "}
                          <span className="text-black">
                            ({product?.size?.toLocaleUpperCase()})
                          </span>
                        </Link>
                      </span>
                      <span className="block text-lg md:text-xl  mx-5">
                        <button
                          onClick={() =>
                            settingQuantities("decrement", product)
                          }
                          className="px-4 py-1 sm:px-4 sm:py-1 text-[15px] md:text-lg rounded-lg bg-slate-200 hover:bg-orange-600 hover:text- hite duration-200"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={product.quantity}
                          readOnly
                          className="w-14 text-center text-[15px] md:text-xl rounded-xl mx-2"
                        />
                        <button
                          onClick={() =>
                            settingQuantities("increment", product)
                          }
                          className="px-4 py-1 sm:px-4 sm:py-1 text-[15px] md:text-lg rounded-lg bg-slate-200 hover:bg-orange-600 hover:text-white duration-200 "
                        >
                          +
                        </button>
                      </span>

                      {/* Total */}
                      <span className="block py-2 mx-5 text-[15px] sm:text-lg">
                        PHP {product?.total?.toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleCheckout(product, index)}
                        className=" px-5 py-2 mx-1 text-[15px] sm:text-lg rounded-2xl bg-orange-600 text-white duration-200 "
                      >
                        Checkout
                      </button>
                      <button
                        onClick={() => removingItem(index)}
                        className=" px-5 py-2 mx-1 text-[15px] sm:text-lg rounded-2xl bg-red-600 text-white duration-200 "
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <div>
                <h1 className="text-[20px] sm:text-3xl my-12">
                  "No items in the cart yet."
                </h1>
                <NavLink
                  to={"/products"}
                  onClick={() => settingCategory("allItems")}
                  className="text-xl lg:text-4xl text-black px-5 py-3 my-3 border-[3px] border-[tomato] rounded-3xl hover:bg-[tomato] duration-300"
                >
                  SHOP NOW!
                </NavLink>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cart;
