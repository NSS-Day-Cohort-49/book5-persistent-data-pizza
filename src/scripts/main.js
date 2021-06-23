// All code in all imported modules will be evaluated by the browser before anything else in this file runs
import { PizzaParlor } from "./PizzaParlor.js"
import { fetchCrusts, fetchSizes, fetchToppings, fetchOrders, fetchOrdersToppings } from "./data.js"

// The rest of this file is read by the browser only after the imports above ( and THEIR imports ) have been run
const mainContainer = document.querySelector("#container")

const render = () => {
  mainContainer.innerHTML = PizzaParlor()
}

document.addEventListener(
  "dbStateChanged",
  () => {
    console.log('Order placed! Yay!');
    fetchOrders()
    .then( () => fetchOrdersToppings())
    .then( () => render())
  }
)

// Call fetchSizes in main.js
fetchSizes()
.then( () => fetchToppings())
.then( () => fetchCrusts())
.then( () => fetchOrders())
.then( () => fetchOrdersToppings())
.then( () => render())
