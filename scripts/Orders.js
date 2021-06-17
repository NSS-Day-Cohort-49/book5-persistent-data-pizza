// radio button list of all Veggies in database
import {
  getCrusts,
  getOrders,
  getToppings,
  getSizes,
  getOrdersToppings
} from "./data.js";

console.log("Orders module initialized...");
const crusts = getCrusts();
const toppings = getToppings();
const sizes = getSizes();

export const Orders = () => {

  const orders = getOrders();
  const ordersToppings = getOrdersToppings()

  const arrayOfOrderHTMLStrings = orders.map((order) => {
    let totalCost = 0

    // Find the matching size
    const foundSize = sizes.find((sizeObject) => {
      if (sizeObject.id === order.sizeId) {
        return true
      }
    })
    totalCost += foundSize.price

    // Find the matching crust
    const foundCrust = crusts.find((crust) => crust.id === order.crustId)
    totalCost += foundCrust.price


    // Find all matching toppings
    const foundOrdersToppings = ordersToppings.filter( (orderTopping) => {
        return orderTopping.orderId === order.id
    })

    const foundToppings = toppings.filter(
      (topping) => {
        return foundOrdersToppings.find( //find returns undefined if it finds no match
          (orderTopping) => {
            return orderTopping.toppingId === topping.id
          }
        )
      }
    )

    // What? Another Array method? Yup.
    totalCost += foundToppings.reduce(
      (accumulator, currentItem) => {
        return accumulator + currentItem.price
      }, 0
    )

    // Return the HTML representation of the order
    return `
        <div class="order">
            Order #${order.id} placed at
            ${new Date(order.timestamp).toLocaleString()},
            is a ${foundSize.circumference}-inch ${foundCrust.type}
            with ${foundToppings.map( topping => topping.name).join(" and ")},
            for a cost of ${totalCost.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}. Yum.
        </div>
    `;
  });

  const html = arrayOfOrderHTMLStrings.join("");

  return html;
};
