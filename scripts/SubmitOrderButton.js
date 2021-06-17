import { addCustomerOrder } from "./data.js"

document.addEventListener(
  "click",
  (clickEvent) => {
    if(clickEvent.target.id === "submitOrderButton"){
      const customerOrderSuccess = addCustomerOrder()

      if(!customerOrderSuccess){
        window.alert("Your order is incomplete! Please choose from all options.")
      }
    }
  }
)

export const SubmitOrderButton = () => {
    return `
        <button id="submitOrderButton">Submit Order</button>
    `
}
