const database = {
  toppings: [
    {
      id: 1,
      name: "black olives",
      price: 1.25,
      type: "veggie"
    },
    {
      id: 2,
      name: "pepperoni",
      price: 2.25,
      type: "meat"
    },
    {
      id: 3,
      name: "sausage",
      price: 2.50,
      type: "meat"
    },
    {
      id: 4,
      name: "onions",
      price: 1.25,
      type: "veggie"
    },
    {
      id: 5,
      name: "green peppers",
      price: 1.25,
      type: "veggie"
    },
    {
      id: 6,
      name: "meatball",
      price: 2.25,
      type: "meat"
    },
    {
      id: 7,
      name: "pineapple",
      price: 1.25,
      type: "disgusting"
    },
  ],
  crusts: [
    {
      id: 1,
      type: "deep dish",
      price: 2
    },
    {
      id: 2,
      type: "NY style",
      price: 1
    },
    {
      id: 3,
      type: "traditional hand tossed",
      price: 0
    }
  ],
  sizes: [
    {
      id: 1,
      circumference: 12,
      price: 7
    },
    {
      id: 2,
      circumference: 14,
      price: 10
    },
    {
      id: 3,
      circumference: 16,
      price: 12
    }
  ],
  orders: [
    {
      id: 1,
      sizeId: 2,
      crustId: 2,
      timestamp: 1620059468223
    },
    {
      id: 2,
      sizeId: 3,
      crustId: 1,
      timestamp: 1620059468300
    }
  ],
  orders_toppings: [
    {
      id: 1,
      orderId: 1,
      toppingId: 1
    },
    {
      id: 2,
      orderId: 1,
      toppingId: 4
    },
    {
      id: 3,
      orderId: 2,
      toppingId: 3
    },
    {
      id: 4,
      orderId: 2,
      toppingId: 5
    },
    {
      id: 5,
      orderId: 2,
      toppingId: 1
    },
  ]
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

export const getSizes = () => {
  return [...database.sizes]
}

export const getCrusts = () => {
  return [...database.crusts]
}

export const getToppings = () => {
  return [...database.toppings]
}

export const getOrders = () => {
  return [...database.orders]
}

export const getOrdersToppings = () => {
  return [...database.orders_toppings]
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
