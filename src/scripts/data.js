const applicationState = {
  crusts: [],
  toppings: [],
  sizes: [],
  orders: [],
  orders_toppings: [],
  orderState: {
    toppings: []
  }
}

const APIUrl = "http://localhost:8088"

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

// Add user form selections to application state
export const setOrderSize = (id) => {
  applicationState.orderState.sizeId = id
}

export const setOrderCrust = (id) => {
  applicationState.orderState.crustId = id
}

export const setOrderTopping = (id) => {
  if (!applicationState.orderState.toppings.includes(id)) {
    applicationState.orderState.toppings.push(id)
  } else {
    applicationState.orderState.toppings = applicationState.orderState.toppings.filter( (toppingId) => toppingId !== id)
  }
  console.log(applicationState.orderState.toppings)
}

const validOrder = () => {
  return (
    applicationState.orderState.toppings.length > 0 &&
    "crustId" in applicationState.orderState &&
    "sizeId" in applicationState.orderState
  )
}

export const addCustomerOrder = () => {
  if (validOrder()) {
    // Copy the current state of user choices, excpet for toppings, which will be stored in a join table!
    const newOrder = {
      crustId: applicationState.orderState.crustId,
      sizeId: applicationState.orderState.sizeId,
    }

    // Add a timestamp to the order
    newOrder.timestamp = Date.now()

    // Add the new order object to custom orders state
    // database.orders.push(newOrder)

    fetch(`${APIUrl}/orders`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder)
    })
    .then((response) => response.json())
    .then((newOrderWithId) => {
      const orderToppingsFetchCalls = []
      // Add new records of relatioship between topping(s) and the new order
      for (const tId of applicationState.orderState.toppings) {
        const newOrderTopping = {
          orderId: newOrderWithId.id,
          toppingId: tId
        }
        orderToppingsFetchCalls.push(fetch(`${APIUrl}/orders_toppings`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrderTopping)
        }))
      }

      // This allows us to wait until ALL order_toppings records have been created before re-rendering all of our orders
      Promise.all(orderToppingsFetchCalls)
      .then( () => {
        document.dispatchEvent(new CustomEvent("dbStateChanged"));
      })

    });

    // Reset the temporary state for user choices
    //orderState = {toppings: []}
    // Broadcast a notification that permanent state has changed
    //document.dispatchEvent(new CustomEvent("dbStateChanged"))

    return true
  }

  return false
}


// API interactions
// getting data from our persistent state ( the database )

export const fetchCrusts = () => {
  // Use HTTP GET request to ask for the crusts resource in our db
  return fetch(`${APIUrl}/crusts`)
  // We have to wait for the response to come back from the db
  // then() calls the function we give it, and it passes into the function the returned data
  .then( (response) => response.json())
  .then( (crustsArray) => {
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

export const fetchOrders = () => {
  return fetch(`${APIUrl}/orders`)
  .then( (response) => response.json() )
  .then( (ordersData) => applicationState.orders = ordersData)
}

export const fetchOrdersToppings = () => {
  return fetch(`${APIUrl}/orders_toppings`)
  .then( (response) => response.json() )
  .then( (otData) => applicationState.orders_toppings = otData)
}
