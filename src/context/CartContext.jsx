import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import PropTypes from "prop-types";


const CartContext = createContext(null);



/* =====================================================
   CREATE UNIQUE ID
===================================================== */

const createCartId = () => {

  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return Date.now().toString();

};





/* =====================================================
   LOAD CART FROM LOCAL STORAGE
===================================================== */

const getInitialState = () => {

  try {

    const savedCart =
      localStorage.getItem("cart");


    const cart =
      savedCart
        ? JSON.parse(savedCart)
        : [];



    return {

      cart: cart.map((item) => ({

        ...item,

        cartId:
          item.cartId ||
          createCartId(),

      })),

      lastAddedId:null,

    };


  } catch(error){


    console.error(
      "Failed to load cart:",
      error
    );


    return {

      cart:[],

      lastAddedId:null,

    };


  }

};








/* =====================================================
   CART REDUCER
===================================================== */

function cartReducer(
  state,
  action
){


switch(action.type){



/* =========================
   ADD TO CART
========================= */

case "ADD_TO_CART": {


const product =
  action.payload;



const existingItem =
state.cart.find(
(item)=>

item.id === product.id &&

item.selectedColor === product.selectedColor &&

item.selectedSize === product.selectedSize

);





if(existingItem){


return {

...state,


cart:
state.cart.map(
(item)=>

item.cartId === existingItem.cartId

?

{

...item,

quantity:
item.quantity + 1,

}

:

item

),



lastAddedId:
existingItem.cartId,


};


}





const newItem = {

...product,

cartId:
createCartId(),

quantity:
Math.max(
product.quantity || 1,
1
),

};





return {


...state,


cart:[
...state.cart,
newItem
],


lastAddedId:
newItem.cartId,


};


}







/* =========================
   INCREASE
========================= */

case "INCREASE": {


return {


...state,


cart:
state.cart.map(
(item)=>

item.cartId === action.payload

?

{

...item,

quantity:
item.quantity + 1,

}

:

item

)


};


}









/* =========================
   DECREASE
========================= */

case "DECREASE": {


return {


...state,


cart:
state.cart.map(
(item)=>

item.cartId === action.payload &&
item.quantity > 1

?

{

...item,

quantity:
item.quantity - 1,

}

:

item

)


};


}









/* =========================
   REMOVE ITEM
========================= */

case "REMOVE_ITEM": {


return {


...state,


cart:
state.cart.filter(
(item)=>

item.cartId !== action.payload

),



lastAddedId:

state.lastAddedId === action.payload

?

null

:

state.lastAddedId,


};


}









/* =========================
   CLEAR CART
========================= */

case "CLEAR_CART": {


return {

cart:[],

lastAddedId:null,

};


}








default:

return state;


}


}









/* =====================================================
   CART PROVIDER
===================================================== */

export function CartProvider({
children
}) {


const [
state,
dispatch
]=useReducer(

cartReducer,

undefined,

getInitialState

);








/* SAVE CART */

useEffect(()=>{


try{


localStorage.setItem(

"cart",

JSON.stringify(
state.cart
)

);


}

catch(error){

console.error(
"Failed to save cart:",
error
);

}


},[state.cart]);









/* CART COUNT */

const cartCount =
useMemo(()=>{


return state.cart.reduce(

(total,item)=>

total + item.quantity,

0

);


},[state.cart]);









/* CART TOTAL */

const cartTotal =
useMemo(()=>{


return state.cart.reduce(

(total,item)=>

total +

Number(item.price) *

item.quantity,


0

);


},[state.cart]);









const value =
useMemo(()=>({


state,

dispatch,

cartCount,

cartTotal,


}),[

state,

cartCount,

cartTotal

]);









return (

<CartContext.Provider value={value}>

{children}

</CartContext.Provider>

);


}








CartProvider.propTypes = {

children:
PropTypes.node.isRequired,

};









/* =====================================================
   CUSTOM HOOK
===================================================== */

export function useCart(){


const context =
useContext(CartContext);



if(!context){

throw new Error(
"useCart must be used inside CartProvider."
);

}



return context;


}



export default CartContext;