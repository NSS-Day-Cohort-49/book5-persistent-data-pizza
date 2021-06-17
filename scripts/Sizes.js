// radio button list of all sizes in database
import {getSizes, setOrderSize} from "./data.js"

const sizes = getSizes()

document.addEventListener(
    "change",
    (changeEvent) => {
        if(changeEvent.target.name === "size") {
            const [, sizeId] = changeEvent.target.value.split("--")

            setOrderSize(parseInt(sizeId))
        }
    }
)

export const SizeHTML = () => {
    const sizeMenu = `
        <ul class="choice--list size--list">
        ${sizes.map( (size) => `
            <li class="choice-list-item size--list-item">
              <input type="radio" value="size--${size.id}" name="size"> ${size.circumference}-inch
              <div class="price">Price: $${size.price.toFixed(2)}</div>
            </li>`
          ).join("")}
        </ul>`

    return sizeMenu
}
