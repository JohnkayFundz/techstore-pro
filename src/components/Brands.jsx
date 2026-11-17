function Brands() {
 const categories = ["Laptops", "Phones", "Audio", "Wearables", "Accessories", "Tablets"];
 return <section className="brands section"><div className="container"><div className="section-header"><h2>Explore Demo Categories</h2><p>Sample storefront content only. Add brand names and claims only when authorized and accurate.</p></div><div className="brands-grid">{categories.map((category) => <div className="brand-card" key={category}><div className="brand-logo" aria-hidden="true">◇</div><h3>{category}</h3></div>)}</div></div></section>;
}
export default Brands;
