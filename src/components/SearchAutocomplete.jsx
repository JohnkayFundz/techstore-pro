import {
  Link
} from "react-router-dom";

import {
  useState,
  useMemo,
} from "react";


import products from "../../data/products";

import {
 useSearch
} from "../../context/SearchContext";



function SearchAutocomplete(){


const [query,setQuery]=useState("");



const {
 addSearch,
 recentSearches
}=useSearch();






const results =
useMemo(()=>{


if(!query)
return [];


return products
.filter(product=>

product.name
.toLowerCase()
.includes(
query.toLowerCase()
)

)
.slice(0,5);



},[query]);








function handleSearch(value){


setQuery(value);


}






return (

<div className="search-autocomplete">


<input

type="search"

placeholder="Search products..."

value={query}

onChange={
e =>
handleSearch(
e.target.value
)
}


/>





{
query && results.length > 0 && (

<div className="search-dropdown">


{
results.map(product=>(


<Link

key={product.id}

to={`/product/${product.id}`}

onClick={()=>{

addSearch(query);

setQuery("");

}}

className="search-item"

>


<img

src={product.image}

alt={product.name}

/>



<span>

{product.name}

</span>



</Link>


))

}


</div>

)

}







{
!query &&
recentSearches.length > 0 && (

<div>

<h4>
Recent Searches
</h4>


{
recentSearches.map(item=>(

<p key={item}>
{item}
</p>

))

}


</div>

)

}



</div>

);


}



export default SearchAutocomplete;