export function sortProducts(
  products,
  sortOption,
  searchTerm = ""
) {

  let result = [...products];


  switch (sortOption) {


    case "name-asc":

      result.sort(
        (a, b) =>
          (a.name || "")
          .localeCompare(
            b.name || ""
          )
      );

      break;





    case "name-desc":

      result.sort(
        (a, b) =>
          (b.name || "")
          .localeCompare(
            a.name || ""
          )
      );

      break;





    case "price-low":

      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );

      break;





    case "price-high":

      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );

      break;





    case "rating":

      result.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );

      break;





    case "popularity":

      result.sort(
        (a, b) =>
          (b.popularity || 0) -
          (a.popularity || 0)
      );

      break;






    case "relevance":


      if(searchTerm.trim()) {


        const term =
          searchTerm
          .trim()
          .toLowerCase();



        const calculateScore =
          (product) => {


            let points = 0;


            const name =
              product.name
              ?.toLowerCase() || "";



            const brand =
              product.brand
              ?.toLowerCase() || "";



            const description =
              product.description
              ?.toLowerCase() || "";





            if(name.includes(term))
              points += 50;



            if(brand.includes(term))
              points += 30;



            if(description.includes(term))
              points += 20;



            if(product.featured)
              points += 10;



            if(product.bestseller)
              points += 15;



            if(product.newArrival)
              points += 5;



            points +=
              product.rating || 0;



            return points;

          };





        result.sort(
          (a,b)=>
          calculateScore(b) -
          calculateScore(a)
        );


      }


      break;






    default:

      break;


  }



  return result;

}