import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";


const RecentlyViewedContext =
  createContext();



export function RecentlyViewedProvider({
  children,
}) {


  const [recentlyViewed,setRecentlyViewed] =
    useState(()=>{


      const saved =
        localStorage.getItem(
          "recentlyViewed"
        );


      return saved
        ? JSON.parse(saved)
        : [];


    });





  useEffect(()=>{


    localStorage.setItem(

      "recentlyViewed",

      JSON.stringify(
        recentlyViewed
      )

    );


  },[
    recentlyViewed
  ]);







  function addRecentlyViewed(product){



    setRecentlyViewed(
      previous => {


        const filtered =
          previous.filter(

            item =>
            item.id !== product.id

          );



        return [

          product,

          ...filtered,

        ].slice(0,6);


      }
    );


  }







  function clearRecentlyViewed(){


    setRecentlyViewed([]);

  }







  return (

    <RecentlyViewedContext.Provider

      value={{

        recentlyViewed,

        addRecentlyViewed,

        clearRecentlyViewed,

      }}

    >

      {children}

    </RecentlyViewedContext.Provider>

  );

}







RecentlyViewedProvider.propTypes = {

  children:
  PropTypes.node.isRequired,

};








export function useRecentlyViewed(){


  const context =
    useContext(
      RecentlyViewedContext
    );



  if(!context){

    throw new Error(
      "useRecentlyViewed must be used inside RecentlyViewedProvider"
    );

  }



  return context;


}