// radio button list of all crusts in database
import {getCrusts, setOrderCrust} from "./data.js"

const crusts = getCrusts()

document.addEventListener(
    "change",
    (changeEvent) => {
        if(changeEvent.target.name === "crust") {
            const [prompt, crustId] = changeEvent.target.value.split("--")

            setOrderCrust(parseInt(crustId))
        }
    }
)
export const CrustHTML = () => {

    let html = "<ul class='choice--list crust--list'>"

    for (const crust of crusts) {
        html += `<li class="choice-list-item crust--list-item">
        <input type="radio" value="crust--${crust.id}" name="crust"> ${crust.type}
        <div class="price">Price: $${crust.price.toFixed(2)}</div>
        </li>`
    }

    html += "</ul>"
    return html
}
