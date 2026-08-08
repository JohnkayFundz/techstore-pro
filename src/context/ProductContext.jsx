import { createContext, useContext } from "react";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  return (
    <ProductContext.Provider value={{}}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  return useContext(ProductContext);
}