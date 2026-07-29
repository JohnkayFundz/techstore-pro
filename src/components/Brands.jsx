function Brands() {
  const brands = [
    {
      name: "Apple",
      logo: "🍎",
    },
    {
      name: "Samsung",
      logo: "📱",
    },
    {
      name: "Sony",
      logo: "🎧",
    },
    {
      name: "Dell",
      logo: "💻",
    },
    {
      name: "HP",
      logo: "🖥️",
    },
    {
      name: "Lenovo",
      logo: "⌨️",
    },
  ];

  return (
    <section className="brands section">
      <div className="container">
        <div className="section-header">
          <h2>Trusted Brands</h2>
          <p>
            Shop premium products from the world's leading technology companies.
          </p>
        </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="brand-card"
            >
              <div className="brand-logo">
                {brand.logo}
              </div>

              <h3>{brand.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Brands;