import { useContext } from "react";
import { cartProductsContext } from "./CartContext";
import { NavLink, Link } from "react-router-dom";

const Home = () => {
  const { allProducts, setIsView, setCurrItem } =
    useContext(cartProductsContext);
  const newArrivals = [
    allProducts.hoodies?.[0],
    allProducts.hoodies?.[1],
    allProducts.jackets?.[0],
    allProducts.jackets?.[1],
    allProducts.tshirts?.[0],
    allProducts.poloshirts?.[0],
  ].filter((item) => item); 

  return (
    <div className="homeContainer text-center bg-no-repeat bg-cover bg-center">
      <div className="flex flex-wrap mb-14">
        <div className="leftContainer hidden lg:flex lg:w-[50%] justify-center items-center h-[72vh] ">
          <h1 className="lg:text-[4rem] xl:text-[4.5rem] text-orange-500 font-extrabold">
            WELCOME
          </h1>
        </div>

        <div className="rightContainer w-[100%] lg:w-[50%] h-[70vh] lg:h-[72vh] flex flex-wrap justify-center bg-slate-300 hover:bg-slate-500">
          <h1 className="self-end w-full lg:hidden text-6xl md:text-7xl text-orange-500 font-extrabold">
            WELCOME
          </h1>
          <br />
          <NavLink
            to={"/products"}
            onClick={() => settingCategory("allItems")}
            className="animate-bounce self-start lg:self-center text-[13px] md:text-2xl text-white px-5 py-3 my-4 border-[3px] border-[tomato] rounded-3xl bg-orange-400 hover:bg-[tomato] duration-300"
          >
            SHOP NOW !
          </NavLink>
        </div>
      </div>

      <h1 className=" clear-both text-[25px] sm:text-4xl text-orange-500 font-bold mb-8">
        NEW ARRIVAL
      </h1>

      {/* NEW ARRIVAL PRODUCTS */}
      <main className="flex flex-wrap justify-center items-center gap-6 place-items-center">
        {newArrivals.length > 0 ? (
          newArrivals.map((item, index) => (
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
          ))
        ) : (
          <>FAILED TO LOAD PRODUCTS</>
        )}
      </main>
    </div>
  );
};

export default Home;
