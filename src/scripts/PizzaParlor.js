// generates all the HTML
import { CrustHTML } from "./Crusts.js"
import { SizeHTML } from "./Sizes.js"
import { ToppingHTML } from "./Toppings.js"
import { Orders } from "./Orders.js"
import { SubmitOrderButton } from "./SubmitOrderButton.js"

export const PizzaParlor = () => {
    return  `
    <h1 class="welcome-message">Hi! Welcome To Mama Leoni's Pizza Place</h1>
    <div class="ingredients--container">
        <article>
            <h2>Sizes</h2>
            ${SizeHTML()}
        </article>
        <article>
            <h2>Crusts</h2>
            ${CrustHTML()}
        </article>
        <article>
            <h2>Toppings</h2>
            ${ToppingHTML()}
        </article>
    </div>
    </article>
      ${SubmitOrderButton()}
    <article>
        <h2>Orders Placed</h2>
        ${Orders()}
    </article>
    `
}
