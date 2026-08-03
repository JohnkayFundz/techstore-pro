import { FiSearch } from "react-icons/fi";

import { useProduct } from "../../context/ProductContext";


function SearchBar() {

  const {
    search,
    setSearch,
  } = useProduct();


  return (
    <div className="search-bar">

      <FiSearch size={20} />


      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>
  );
}


export default SearchBar;