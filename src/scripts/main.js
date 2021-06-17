import { PizzaParlor } from "./PizzaParlor.js"

console.log("Hello, Pizza lovers")
const mainContainer = document.querySelector("#container")

const render = () => {
  mainContainer.innerHTML = PizzaParlor()
}

render()

document.addEventListener(
  "dbStateChanged",
  () => {
      render()
  }
)
