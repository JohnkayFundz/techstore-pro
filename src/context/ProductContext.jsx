import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { products } from "../data/products";


const ProductContext = createContext(null);


export function ProductProvider({ children }) {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");


  const filteredProducts = useMemo(() => {

    const searchTerm =
      search.toLowerCase();


    return products.filter((product) => {


      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm) ||

        product.brand
          .toLowerCase()
          .includes(searchTerm);



      const matchesCategory =
        category === "All" ||
        product.category === category;



      return (
        matchesSearch &&
        matchesCategory
      );

    });


  }, [search, category]);



  return (

    <ProductContext.Provider

      value={{

        products,

        filteredProducts,


        search,

        setSearch,


        category,

        setCategory,

      }}

    >

      {children}

    </ProductContext.Provider>

  );

}



export function useProduct() {

  const context =
    useContext(ProductContext);


  if (!context) {

    throw new Error(
      "useProduct must be used inside ProductProvider"
    );

  }


  return context;

}