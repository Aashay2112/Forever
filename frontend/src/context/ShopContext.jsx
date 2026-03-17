import axios from "axios";
import { toast } from "react-toastify";
import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");

  // PRODUCTS
  const [products,setProducts] = useState([]);

  // SEARCH
  const [search,setSearch] = useState("");
  const [showSearch,setShowSearch] = useState(false);

  // TOKEN
  const [token,setToken] = useState(localStorage.getItem("token") || "");

  const isLoggedIn = Boolean(token);

  const logout = () => {
    // Save current cart to localStorage before clearing token
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setToken("");
  };

  // CART
  const [cartItems,setCartItems] = useState(()=>{
    if(token) return {};
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // SAVE CART LOCALLY
  useEffect(()=>{
    if(!token){
      localStorage.setItem("cart",JSON.stringify(cartItems));
    }
  },[cartItems,token]);

  // SAVE TOKEN
  useEffect(()=>{

    if(token){
      localStorage.setItem("token",token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }else{
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }

  },[token]);



  // LOAD CART FROM BACKEND
  const loadCartFromBackend = async ()=>{

    if(!token) return;

    try{

      const response = await axios.get(
        backendUrl + "/api/cart/get",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      if(response.data.success){
        setCartItems(response.data.cartData || {});
      }

    }catch(error){
      console.log("Cart load error:",error);
    }

  };


  // SAVE CART TO BACKEND
  const saveCartToBackend = async (newCart)=>{

    if(!token) return;

    try{

      await axios.post(
        backendUrl + "/api/cart/update",
        { cartData:newCart },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

    }catch(error){
      console.log("Cart save error:",error);
    }

  };


  // MERGE LOCAL CART ON LOGIN
  useEffect(()=>{

    if(token){

      const localCart = localStorage.getItem("cart");

      if(localCart){

        const parsed = JSON.parse(localCart);

        const mergedCart = {...parsed};

        setCartItems(mergedCart);

        saveCartToBackend(mergedCart);

        localStorage.removeItem("cart");

      }else{

        loadCartFromBackend();

      }

    }

  },[token]);


  // GET PRODUCTS
  const getProductData = async ()=>{

    try{

      const response = await axios.get(
        backendUrl + "/api/product/list"
      );

      if(response.data.success){
        setProducts(response.data.products);
      }

    }catch(error){
      console.log(error);
    }

  };

  useEffect(()=>{
    getProductData();
  },[]);



  const addToCart = async (itemId,size)=>{

    if(!size){
      toast.error("Please select size");
      return;
    }

    let cartData = {...cartItems};

    if(!cartData[itemId]){
      cartData[itemId] = {};
    }

    if(!cartData[itemId][size]){
      cartData[itemId][size] = 0;
    }

    cartData[itemId][size] += 1;

    setCartItems(cartData);

    if(token){
      await saveCartToBackend(cartData);
    }

  };


  // REMOVE FROM CART
  const removeFromCart = async (itemId,size)=>{

    let cartData = {...cartItems};

    if(cartData[itemId][size] > 1){
      cartData[itemId][size] -= 1;
    }
    else{
      delete cartData[itemId][size];
    }

    if(Object.keys(cartData[itemId]).length === 0){
      delete cartData[itemId];
    }

    setCartItems(cartData);

    if(token){
      await saveCartToBackend(cartData);
    }

  };


  // UPDATE QUANTITY
  const updateQuantity = async (itemId,size,quantity)=>{

    let cartData = {...cartItems};

    if(quantity === 0){

      delete cartData[itemId][size];

      if(Object.keys(cartData[itemId]).length === 0){
        delete cartData[itemId];
      }

    }else{
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if(token){
      await saveCartToBackend(cartData);
    }

  };


  // CART COUNT
  const getCartCount = ()=>{

    let total = 0;

    for(const item in cartItems){
      for(const size in cartItems[item]){
        total += cartItems[item][size];
      }
    }

    return total;

  };


  // CART AMOUNT
  const getCartAmount = ()=>{

    let total = 0;

    for(const item in cartItems){

      const product = products.find(p=>p._id === item);

      if(!product) continue;

      for(const size in cartItems[item]){
        total += product.price * cartItems[item][size];
      }

    }

    return total;

  };


  const value = {

    products,
    currency,
    delivery_fee,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,

    getCartCount,
    getCartAmount,

    backendUrl,

    token,
    setToken,
    isLoggedIn,
    logout

  };


  return(

    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>

  );

};

export default ShopContextProvider;