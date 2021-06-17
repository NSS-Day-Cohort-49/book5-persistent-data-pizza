// radio button list of all toppings in database
import {getToppings, setOrderTopping} from "./data.js"

const toppings = getToppings()

document.addEventListener(
  "change",
  (event) => {
    if(event.target.name === "topping") {
      const toppingId = event.target.value
      setOrderTopping(parseInt(toppingId))
    }
  }
)

export const ToppingHTML = () => {
  let html = "<ul class='choice--list topping--list'>"

  for (const topping of toppings) {
    html += `<li class="choice-list-item topping--list-item">
    <input type="checkbox" value="${topping.id}" name="topping"> ${topping.name}
    <div class="price">Price: $${topping.price.toFixed(2)}</div>
    </li>`
  }

  html += "</ul>"
  return html
}
