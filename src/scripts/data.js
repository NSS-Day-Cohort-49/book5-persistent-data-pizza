const applicationState = {
  crusts: [],
  toppings: [],
  sizes: [],
  orders: [],
  orders_toppings: []
}

let orderState = {toppings: []}

// const calcId = (arr) => {
//   const lastIndex = arr.length - 1
//   if (lastIndex === -1) {
//     const newId = 1
//     return newId
//   }
//   const lastItemId = arr[lastIndex].id
//   const newId = lastItemId + 1
//   return newId
// }

// export const checkOrderState = () => {
//   return (
//     "metalId" in database.orderBuilder &&
//     "sizeId" in database.orderBuilder &&
//     "styleId" in database.orderBuilder
//     )
// }

// providing copies of application ( in memory) data
export const getSizes = () => {
  return [...applicationState.sizes]
}

export const getCrusts = () => {
  return [...applicationState.crusts]
}

export const getToppings = () => {
  return [...applicationState.toppings]
}

export const getOrders = () => {
  return [...applicationState.orders]
}

export const getOrdersToppings = () => {
  return [...applicationState.orders_toppings]
}

export const setOrderSize = (id) => {
  orderState.sizeId = id
}

export const setOrderCrust = (id) => {
  orderState.crustId = id
}

export const setOrderTopping = (id) => {
  if (!orderState.toppings.includes(id)) {
    orderState.toppings.push(id)
  } else {
    orderState.toppings = orderState.toppings.filter( (toppingId) => toppingId !== id)
  }
  console.log(orderState.toppings)
}

const validOrder = () => {
  return (
    orderState.toppings.length > 0 &&
    "crustId" in orderState &&
    "sizeId" in orderState
  )
}

export const addCustomerOrder = () => {
  if (validOrder()) {
    // Copy the current state of user choices, excpet for toppings, which will be stored in a join table!
    const newOrder = {
      crustId: orderState.crustId,
      sizeId: orderState.sizeId,
    }

    // Add a new primary key to the object
    const lastIndex = database.orders.length - 1
    newOrder.id = lastIndex >= 0 ? database.orders[lastIndex].id + 1 : 1

    // Add a timestamp to the order
    newOrder.timestamp = Date.now()

    // Add the new order object to custom orders state
    database.orders.push(newOrder)

    // Add new records of relatioship between topping(s) and the new order
    for (const tId of orderState.toppings) {
      const newOrderTopping = {
        id:  database.orders_toppings.length - 1 >= 0 ? database.orders_toppings[lastIndex].id + 1 : 1,
        orderId: newOrder.id,
        toppingId: tId
      }
      database.orders_toppings.push(newOrderTopping)
    }
    // Reset the temporary state for user choices
    orderState = {toppings: []}
    // Broadcast a notification that permanent state has changed
    document.dispatchEvent(new CustomEvent("dbStateChanged"))

    return true
  }

  return false
}


// API interactions
// getting data from our persistent state ( the database )
const APIUrl = "http://localhost:8088"

export const fetchCrusts = () => {
  console.log("first line of the function", Date.now())
  // Use HTTP GET request to ask for the crusts resource in our db
  return fetch(`${APIUrl}/crusts`)
  // We have to wait for the response to come back from the db
  // then() calls the function we give it, and it passes into the function the returned data
  .then( (response) => response.json())
  .then( (crustsArray) => {
      console.log("this runs second", Date.now())
      applicationState.crusts = crustsArray
    })
  }

export const fetchSizes = () => {
  // Make an HTTP request to the db to get sizes data
  return fetch(`${APIUrl}/sizes`)
  // Turn the returned data into a JS array of objects
  .then( (response) => response.json())
  .then( (sizesArray) => {
    // Update the application state with the newly fetched sizes data
    applicationState.sizes = sizesArray
  })
}

export const fetchToppings = () => {
  return fetch(`${APIUrl}/toppings`)
  .then( (response) => response.json() )
  .then( (toppingsData) => applicationState.toppings = toppingsData)
}
