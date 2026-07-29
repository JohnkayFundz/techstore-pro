import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import PropTypes from "prop-types";


const WishlistContext = createContext(null);





/* =====================================================
   LOAD WISHLIST FROM LOCAL STORAGE
===================================================== */

const getInitialState = () => {

  try {

    const savedWishlist =
      localStorage.getItem("wishlist");


    return savedWishlist
      ? JSON.parse(savedWishlist)
      : [];


  } catch(error) {


    console.error(
      "Failed to load wishlist:",
      error
    );


    return [];

  }

};








/* =====================================================
   WISHLIST REDUCER
===================================================== */

function wishlistReducer(
  state,
  action
){


switch(action.type){



/* =========================
   TOGGLE ITEM
========================= */

case "TOGGLE":


return state.includes(action.payload)

?

state.filter(
(id)=>id !== action.payload
)

:

[
...state,
action.payload
];








/* =========================
   REMOVE ITEM
========================= */

case "REMOVE":


return state.filter(

(id)=>

id !== action.payload

);








/* =========================
   CLEAR ALL
========================= */

case "CLEAR":


return [];








default:

return state;


}


}









/* =====================================================
   PROVIDER
===================================================== */

export function WishlistProvider({
children
}) {


const [
wishlist,
dispatch
] = useReducer(

wishlistReducer,

undefined,

getInitialState

);








/* SAVE */

useEffect(()=>{


try{


localStorage.setItem(

"wishlist",

JSON.stringify(
wishlist
)

);


}

catch(error){


console.error(
"Failed to save wishlist:",
error
);


}


},[wishlist]);









/* TOGGLE HELPER */

const toggleWishlist =
useCallback(
(productId)=>{


dispatch({

type:"TOGGLE",

payload:productId,

});


},
[]
);









/* CHECK */

const isWishlisted =
useCallback(

(productId)=>

wishlist.includes(productId),

[wishlist]

);









/* CLEAR */

const clearWishlist =
useCallback(()=>{


dispatch({

type:"CLEAR",

});


},[]);








const value =
useMemo(()=>({


wishlist,

dispatch,

toggleWishlist,

isWishlisted,

clearWishlist,


}),[

wishlist,

toggleWishlist,

isWishlisted,

clearWishlist

]);








return (

<WishlistContext.Provider value={value}>

{children}

</WishlistContext.Provider>

);


}







WishlistProvider.propTypes = {

children:
PropTypes.node.isRequired,

};









/* =====================================================
   CUSTOM HOOK
===================================================== */

export function useWishlist(){


const context =
useContext(WishlistContext);



if(!context){


throw new Error(
"useWishlist must be used inside WishlistProvider."
);


}



return context;


}



export default WishlistContext;