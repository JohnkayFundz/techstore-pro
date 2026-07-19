import { useState } from "react";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

function Home() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All");

	const filtered = products.filter((p) => {
		const matchesCategory = category === "All" || p.category === category;
		const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="container">
			<Hero />
			<SearchBar search={search} setSearch={setSearch} />
			<CategoryFilter category={category} setCategory={setCategory} />
			<ProductGrid products={filtered} />
		</div>
	);
}

export default Home;