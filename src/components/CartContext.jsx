import { supabase } from "../supabase-client";
import { createContext, useState, useEffect } from "react";
export const cartProductsContext = createContext();

const CartContext = ({ children }) => {
  //INITIALIZATIONS IN LOCAL STORAGE
  const [addToCart, setAddToCart] = useState(() => {
    try {
      const saved = localStorage.getItem("addToCart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quantities, setQuantities] = useState(() => {
    try {
      const saved = localStorage.getItem("quantities");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [itemNum, setItemNum] = useState(() => {
    try {
      const saved = parseInt(localStorage.getItem("itemNum"));
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  // when clicked view product
  const [isView, setIsView] = useState(() => {
    try {
      const saved = localStorage.getItem("isView");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  const [isChanging, setIsChanging] = useState(() => {
    try {
      const saved = localStorage.getItem("isChanging");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  const [currItem, setCurrItem] = useState(() => {
    try {
      const saved = localStorage.getItem("currItem");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return {};
    }
  });

  const [size, setSize] = useState(() => {
    try {
      const saved = localStorage.getItem("size");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return "";
    }
  });

  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("allItems");

  const [isSignup, setIsSignup] = useState(false);
  const [isLogin, setIsLogin] = useState(() => {
    try {
      const saved = localStorage.getItem("isLogin");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  const [currUsername, setCurrUsername] = useState(() => {
    try {
      const saved = localStorage.getItem("currUsername");
      return saved ? saved : "Unknown";
    } catch (error) {
      return false;
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [session, setSession] = useState(null);

  // function for checking if there is a session
  const fetchSession = async () => {
    const currSession = await supabase.auth.getSession();
    setSession(currSession.data.session);
  };

  // check if there is currently session from user
  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // function for signing up in supabase

  const handleSignup = async () => {
    // if (!email || !password || !username) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // add your username here
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      alert("ERROR: ", error);
      return;
    }

    console.log("Signup success:", data);

    const session = supabase.auth.session();
  };

  // function for login in supabase
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error: ", error);
      alert("ERROR: Invalid login credentials! ", error);
    } else {
      const {
        data: { session: newSession },
      } = await supabase.auth.getSession();

      const username = newSession?.user?.user_metadata?.username;

      if (username) {
        localStorage.setItem("currUsername", username);
        setCurrUsername(username);
      }

      setIsLogin(true);
      console.log("WELCOME: ", username);
    }
  };

  // SIGNOUT the user
  const handleSignout = async () => {
    setIsLogin(false);
    console.log("Goodbye, ", session?.user?.user_metadata?.username);

    await supabase.auth.signOut();
  };

  // FETCH DATA: all products from PRODUCTS table (clothing-shop database - SUPABASE)
  const [products, setProducts] = useState([]);
  const [hoodies, setHoodies] = useState([]);
  const [jackets, setJackets] = useState([]);
  const [tshirts, setTshirts] = useState([]);
  const [poloshirts, setPoloshirts] = useState([]);

  // function for fetching data
  const fetchAllProducts = async () => {
    // fetch all products from database
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("product_id", { ascending: true });

    if (error) {
      console.error("ERROR: ", error.message);
    }

    setProducts(data);
  };

  // fetch all products once
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // filter products according to their category after fetching ALL
  useEffect(() => {
    // filtering category === "hoodies"
    setHoodies(
      products.filter((product, index) => {
        return product.category === "hoodies";
      })
    );

    // filtering category === "jackets"
    setJackets(
      products.filter((product, index) => {
        return product.category === "jackets";
      })
    );

    // filtering category === "tshirts"
    setTshirts(
      products.filter((product, index) => {
        return product.category === "tshirts";
      })
    );

    // filtering category === "poloshirts"
    setPoloshirts(
      products.filter((product, index) => {
        return product.category === "poloshirts";
      })
    );
  }, [products]);

  // LIST OF ALL PRODUCTS
  const allProducts = {
    allItems: products,
    hoodies: hoodies,
    jackets: jackets,
    tshirts: tshirts,
    poloshirts: poloshirts,
  };

  //PRODUCT CATEGORY
  function settingCategory(categoryInput) {
    setCategory(categoryInput);
  }

  // Fetch user's cart items from Supabase and update state
  const fetchCartFromDB = async () => {
    if (!session) return;

    const { user } = session;

    const { data, error } = await supabase
      .from("carts")
      .select("*, products(*)") // join select all from carts and select all from products table
      .eq("user_id", user.id)
      .order("order_id", { ascending: true });

    if (error) {
      console.error("Error fetching cart:", error.message);
      return;
    }

    // Update addToCart and quantities based on fetched data
    setAddToCart(data);

    const fetchedQuantities = data.map((item) => item.quantity || 1);
    setQuantities(fetchedQuantities);

    const totalItems = fetchedQuantities.reduce((acc, qty) => acc + qty, 0);
    setItemNum(totalItems);
  };

  useEffect(() => {
    if (session) {
      fetchCartFromDB();
    }
  }, [session]);

  // ADD TO CART FUNCTION, adding product to the database
  const settingAddToCart = async (inputted, addedQuantity, pickedSize) => {
    if (!session) {
      console.log("Cannot insert to DB — user not logged in");
      return;
    }

    const { user } = session;

    // fetch the existing addtocart products in the database
    const { data: existingItem } = await supabase
      .from("carts")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("product_id", inputted.product_id)
      .eq("size", pickedSize)
      .maybeSingle();

    // if the product exists, add quantity
    const newQty = existingItem
      ? existingItem.quantity + addedQuantity
      : addedQuantity;

    //calculate total per row
    const total = newQty * inputted.price;

    // UPSERT: insert if not exist yet or update existing row
    const { data, error } = await supabase
      .from("carts")
      .upsert(
        {
          user_id: user.id,
          product_id: inputted.product_id,
          size: pickedSize,
          quantity: newQty,
          total: total,
        },
        { onConflict: "user_id, product_id, size" }
      )
      .select();

    if (error) {
      console.error("Error upserting cart:", error.message);
    }

    // Refresh local cart state
    await fetchCartFromDB();
  };

  //   // UPDATE THE PRODUCT FUNCTION
  //   const updatingAddToCart = async (
  //     inputted,
  //     newQuantity,
  //     newSize,
  //     newTotal
  //   ) => {
  //     // check if the item exists in the database
  //     const exists = addToCart.some(
  //       (item) =>
  //         item.user_id === inputted.user_id &&
  //         item.product_id === inputted.product_id &&
  //         item.size === inputted.size
  //     );

  //     if (exists) {
  //       const { data: existingItem } = await supabase
  //         .from("carts")
  //         .delete()
  //         .eq("order_id", inputted.order_id)
  //         .eq("product_id", inputted.product_id)
  //         .eq("size", newSize);

  //       // UPSERT: insert if not exist yet or update existing row
  //       const { data, error } = await supabase
  //         .from("carts")
  //         .upsert(
  //           {
  //             user_id: user.id,
  //             product_id: inputted.product_id,
  //             size: newSize,
  //             quantity: newQuantity,
  //             total: newTotal,
  //           },
  //           { onConflict: "user_id, product_id, size" }
  //         )
  //         .select();

  //       if (error) {
  //         console.error("Error upserting cart:", error.message);
  //       }

  //       // Refresh local cart state
  //       await fetchCartFromDB();
  //     }

  //     console.log("EXISTS: ", exists);
  //     console.log("INPUTTED: ", inputted);
  //     console.log("CART:", addToCart);

  //     if (!session) {
  //       console.log("Cannot insert to DB — user not logged in");
  //       return;
  //     }

  //     const { user } = session;

  //     // UPSERT: update the value of the item
  //     const { data, error } = await supabase
  //       .from("carts")
  //       .upsert({
  //         order_id: inputted.order_id,
  //         user_id: user.id,
  //         product_id: inputted.product_id,
  //         size: newSize,
  //         quantity: newQuantity,
  //         total: newTotal,
  //       })
  //       .select();

  //     if (error) {
  //       console.error("Error upserting cart:", error.message);
  //     }

  //     // reset state variables to close the view/editing mode.
  //     setIsView(false);
  //     setIsChanging(false);

  //     /*
  // // if the item to be updated isn't found
  //     if (originalIndex === -1) {
  //       console.error("Original item to update not found in cart.");
  //       setIsView(false);
  //       setIsChanging(false);
  //       return;
  //     }

  //     // if an item with the NEW size already exists in the cart.
  //     const newIndex = addToCart.findIndex(
  //       (item) => item.id === inputted.id && item.size === newSize
  //     );

  //     const originalQuantity = quantities[originalIndex];

  //     // item with the new size already exists
  //     if (newIndex !== -1 && newIndex !== originalIndex) {
  //       setQuantities((prevQuantities) => {
  //         const updatedQuantities = [...prevQuantities];
  //         const combinedQuantity = updatedQuantities[newIndex] + newQuantity;

  //         // Set the combined quantity at the new item's index
  //         updatedQuantities[newIndex] = combinedQuantity;

  //         // Remove the quantity entry of the original item
  //         updatedQuantities.splice(originalIndex, 1);

  //         return updatedQuantities;
  //       });

  //       // Update the cart: Remove the original item from the cart array
  //       setAddToCart((prevCart) => {
  //         const updatedCart = [...prevCart];
  //         updatedCart.splice(originalIndex, 1);
  //         return updatedCart;
  //       });
  //     }

  //     // the new size doesn't exist anywhere else in the cart (Update the item in place)
  //     else if (originalIndex === newIndex || newIndex === -1) {
  //       setQuantities((prevQuantities) => {
  //         const updatedQuantities = [...prevQuantities];
  //         updatedQuantities[originalIndex] = newQuantity;
  //         return updatedQuantities;
  //       });

  //       // update the size property of the item object
  //       setAddToCart((prevCart) => {
  //         const updatedCart = [...prevCart];
  //         updatedCart[originalIndex] = {
  //           ...updatedCart[originalIndex],
  //           size: newSize,
  //         };
  //         return updatedCart;
  //       });
  //     }

  //     const quantityDiff = newQuantity - originalQuantity;
  //     setItemNum((prevItemNum) => prevItemNum + quantityDiff);

  //     // reset state variables to close the view/editing mode.
  //     setIsView(false);
  //     setIsChanging(false);
  // */
  //   };

const updatingAddToCart = async (inputted, newQuantity, newSize) => {
  if (!session) return console.log("Cannot update — user not logged in");

  const { user } = session;

  // Find the original item in local cart
  const originalIndex = addToCart.findIndex(
    (item) =>
      item.product_id === inputted.product_id && item.size === inputted.size
  );

  if (originalIndex === -1) {
    console.error("Original item not found in cart");
    return;
  }

  const originalItem = addToCart[originalIndex];
  const price = originalItem.products.price;

  // Check if the item with the NEW size already exists (other than the original)
  const existingIndex = addToCart.findIndex(
    (item) =>
      item.product_id === inputted.product_id &&
      item.size === newSize &&
      item !== originalItem
  );

  if (existingIndex !== -1) {
    // ✅ Combine quantities only
    const combinedQuantity = addToCart[existingIndex].quantity + newQuantity;
    const combinedTotal = price * combinedQuantity;

    // Upsert combined item
    const { error: upsertError } = await supabase.from("carts").upsert(
      {
        user_id: user.id,
        product_id: inputted.product_id,
        size: newSize,
        quantity: combinedQuantity,
        total: combinedTotal,
      },
      { onConflict: "user_id, product_id, size" }
    );
    if (upsertError)
      console.error("Error combining items:", upsertError.message);

    // Delete the original row (since it was merged)
    const { error: deleteError } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", inputted.product_id)
      .eq("size", inputted.size);
    if (deleteError)
      console.error("Error deleting original item:", deleteError.message);

    // Update local state
    setAddToCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: combinedQuantity,
        total: combinedTotal,
      };
      updatedCart.splice(originalIndex, 1); // remove original
      return updatedCart;
    });
  } else {
    // ✅ Update in place (either quantity or size changed)
    const updatedTotal = price * newQuantity;

    // Upsert the updated item
    const { error } = await supabase.from("carts").upsert(
      {
        user_id: user.id,
        product_id: inputted.product_id,
        size: newSize,
        quantity: newQuantity,
        total: updatedTotal,
      },
      { onConflict: "user_id, product_id, size" }
    );
    if (error) console.error("Error updating item:", error.message);

    // Delete original if size changed
    if (originalItem.size !== newSize) {
      const { error: deleteError } = await supabase
        .from("carts")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", inputted.product_id)
        .eq("size", originalItem.size);
      if (deleteError)
        console.error("Error deleting original item:", deleteError.message);
    }

    // Update local state
    setAddToCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[originalIndex] = {
        ...updatedCart[originalIndex],
        size: newSize,
        quantity: newQuantity,
        total: updatedTotal,
      };
      return updatedCart;
    });
  }

  // Update global itemNum
  setItemNum(addToCart.reduce((acc, item) => acc + item.quantity, 0));

  // Close edit/view mode
  setIsView(false);
  setIsChanging(false);
};


  // function for inserting products added by the user
  const insertAllCartItemsToDB = async () => {
    if (!session) {
      console.log("Cannot insert to DB — user not logged in");
      return;
    }

    const { user } = session;

    const itemsToInsert = addToCart
      .filter((item) => item.product_id && item.size)
      .map((item, index) => ({
        user_id: user.id,
        product_id: item.product_id,
        size: item.size,
        quantity: quantities[index] ?? item.quantity ?? 1,
      }));

    // if (itemsToInsert.length === 0) {
    //   console.log("Local cart is empty or invalid. Nothing to sync.");
    //   return;
    // }

    const { data, error } = await supabase.from("carts").insert(itemsToInsert);

    // , {onConflict: "user_id, product_id, size",}.select();

    // if (error) {
    //   console.error("Error inserting cart:", error.message);
    // } else {
    //   console.log(`Successfully synced ${data.length} cart items.`);
    // }
  };

  // useEffect for addTocart
  useEffect(() => {
    localStorage.setItem("addToCart", JSON.stringify(addToCart));

    fetchCartFromDB();
  }, [addToCart]);

  // useEffect for quantities
  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  // useEffect for itemNum
  useEffect(() => {
    localStorage.setItem("itemNum", JSON.stringify(itemNum));
  }, [itemNum]);

  // useEffect for selected size
  useEffect(() => {
    localStorage.setItem("isView", JSON.stringify(isView));
  }, [isView]);

  // useEffect for isLogin
  useEffect(() => {
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
  }, [isLogin]);

  // useEffect for changing specs item
  useEffect(() => {
    localStorage.setItem("isChanging", JSON.stringify(isChanging));
  }, [isChanging]);

  // useEffect for view current item
  useEffect(() => {
    localStorage.setItem("currItem", JSON.stringify(currItem));
  }, [currItem]);

  // useEffect for selected size
  useEffect(() => {
    localStorage.setItem("size", JSON.stringify(size));
  }, [size]);

  function handleTotal() {
    if (addToCart?.length > 0) {
      const calculatedTotal = addToCart.reduce((prev, curr, index) => {
        const quantity = quantities[index];
        const price = curr.price;
        return prev + price * quantity; //default = 0 if undefined
      }, 0);

      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }

  //CALCULATE THE TOTAL EVERYTIME addToCart and quantities change]
  useEffect(() => {
    handleTotal();
  }, [addToCart, quantities]);

  useEffect(() => {
    handleTotal();
  }, [quantities]);

  // QUANTITIES and PRICES
  const settingQuantities = async (type, currProduct, index) => {
    if (!session) return;

    const { user } = session;

    // GET EXISTING ITEM
    const { data: existingItem } = await supabase
      .from("carts")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("product_id", currProduct.product_id)
      .eq("size", currProduct.size)
      .maybeSingle();

    let newQty = existingItem?.quantity ?? currProduct.quantity;

    if (type === "increment") {
      newQty += 1;
    } else if (type === "decrement" && newQty > 1) {
      newQty -= 1;
    }

    // UPDATE BACKEND
    const { error } = await supabase.from("carts").upsert(
      {
        user_id: user.id,
        product_id: currProduct.product_id,
        size: currProduct.size,
        quantity: newQty,
        total: currProduct.products.price * newQty,
      },
      { onConflict: "user_id, product_id, size" }
    );

    if (error) console.error(error);

    await fetchCartFromDB();
  };

  //Removing item function
  const removingItem = async (index) => {
    if (!session) return;

    const { user } = session;

    const item = addToCart[index];
    if (!item) return;

    // DELETE THE ROW FROM DATABASE
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", item.product_id)
      .eq("size", item.size);

    if (error) {
      console.error("Error deleting cart item:", error.message);
      return;
    }

    // ITEM COUNTER UPDATE
    setItemNum((num) => num - item.quantity);

    // REFRESH FROM DB AFTER DELETING
    await fetchCartFromDB();
  };

  // handle checkout specific item
  async function handleCheckout(product, index) {
    const totalPrice = product.products.price * product.quantity;

    console.log(addToCart);

    alert(
      `Item: (${quantities[index]}x - ${
        product.products.name
      }) will be delivered to you within 2-3 days with a total of PHP ${totalPrice.toFixed(
        2
      )}`
    );

    // REMOVE ITEM FROM DATABASE
    await removingItem(index);

    // REMOVE ITEM FROM UI STATES
    setQuantities((quantities) => quantities.filter((_, i) => i !== index));
  }

  // handle checkout all items
  async function handleCheckoutAll() {
    if (!session) return;
    const { user } = session;

    // Calculate total price
    const totalAll = addToCart.reduce((acc, item, index) => {
      const price = item.products?.price || 0;
      const qty = quantities[index] || 1;
      return acc + price * qty;
    }, 0);

    // Alert summary
    const itemSummary = addToCart
      .map((item, index) => `${quantities[index]}x - ${item.products.name}`)
      .join(", ");

    alert(
      `Items: (${itemSummary}) will be delivered to you within 2-3 days. Total: PHP ${totalAll.toFixed(
        2
      )}.`
    );

    // DELETE ALL ITEMS FOR THIS USER
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting all cart items:", error.message);
      return;
    }

    // RESET LOCAL STATES
    setAddToCart([]);
    setQuantities([]);
    setItemNum(0);

    // CLEAR LOCAL STORAGE
    localStorage.setItem("addToCart", JSON.stringify([]));
    localStorage.setItem("quantities", JSON.stringify([]));
    localStorage.setItem("itemNum", JSON.stringify(0));

    // OPTIONAL: refresh from db
    await fetchCartFromDB();
  }

  return (
    <cartProductsContext.Provider
      value={{
        category,
        settingCategory,
        allProducts,
        addToCart,
        quantities,
        itemNum,
        settingAddToCart,
        settingQuantities,
        removingItem,
        handleCheckout,
        handleCheckoutAll,
        total,
        setTotal,
        isView,
        setIsView,
        isChanging,
        setIsChanging,
        currItem,
        setCurrItem,
        size,
        setSize,
        updatingAddToCart,

        isSignup,
        setIsSignup,
        isLogin,
        setIsLogin,
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername,
        handleSignup,
        handleLogin,
        handleSignout,

        currUsername,
        setCurrUsername,
      }}
    >
      {children}
    </cartProductsContext.Provider>
  );
};

export default CartContext;
