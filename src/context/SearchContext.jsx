import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import PropTypes from "prop-types";


const SearchContext =
  createContext();



export function SearchProvider({
  children,
}) {


  const [recentSearches,setRecentSearches] =
    useState(()=>{


      const saved =
        localStorage.getItem(
          "recentSearches"
        );


      return saved
      ? JSON.parse(saved)
      : [];


    });





  useEffect(()=>{


    localStorage.setItem(

      "recentSearches",

      JSON.stringify(
        recentSearches
      )

    );


  },[
    recentSearches
  ]);






  function addSearch(term){


    if(!term.trim())
      return;



    setRecentSearches(prev=>[

      term,

      ...prev.filter(
        item =>
        item !== term
      )

    ].slice(0,5));


  }





  return (

<SearchContext.Provider

value={{

recentSearches,

addSearch,

}}

>

{children}

</SearchContext.Provider>


  );

}







SearchProvider.propTypes = {

children:
PropTypes.node.isRequired,

};








export function useSearch(){

const context =
useContext(SearchContext);



if(!context){

throw new Error(
"useSearch must be used inside SearchProvider"
);

}



return context;


}