const API_URL = "http://localhost:5000/api/orders";


// Create Order
export async function createOrder(orderData) {

  const token = localStorage.getItem("token");


  const response = await fetch(API_URL, {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,

    },

    body: JSON.stringify(orderData),

  });


  return response.json();

}



// Get Logged-in User Orders
export async function getMyOrders() {

  const token = localStorage.getItem("token");


  const response = await fetch(
    `${API_URL}/my-orders`,
    {

      method: "GET",

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }
  );


  return response.json();

}