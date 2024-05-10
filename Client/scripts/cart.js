

const APIURL = "http://127.0.0.1:8080/carts";
const cartContentEL = document.querySelector(".cart-content");
const lblTotalEl = document.getElementById("lbl-total");
const btnRemoveEL = document.getElementById("btn-remove");
const btnCheckoutEL = document.getElementById("btn-checkout");

let cartTotal = 0;



document.addEventListener("DOMContentLoaded", function () {
  lblTotalEl.textContent = parseFloat(cartTotal).toFixed(2);

  // fetch all the cart items
  getCartItems(APIURL);
  
  
});


async function getCartItems(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  console.log("resp Data from Get Cart",respData);

  respData.forEach((data) => {
    const p_id = data.product_id;
    const quantity = data.quantity;
    console.log(p_id);


    const rslt = getProductsByID(p_id);

    rslt.then((rs) => {
      renderCartItem(rs, quantity);
    });
  });
}

function renderCartItem(items, quantity) {
  // cartContentEL.innerHTML = "";

  console.log("Items", items);

  items.forEach((item) => {
    console.log("Item:", item);
    const { image_url, name, price } = item;

    // Parsing the returned JSON price string for the calculation
    const parsedPrice = JSON.parse(price);

    cartTotal = cartTotal + parsedPrice;
    lblTotalEl.textContent = parseFloat(cartTotal).toFixed(2);

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");

    itemEl.innerHTML = `
    <img
    src="${image_url}"
    alt="${name}"
    />
    <div class="title-quantity">
        <h2>${name}</h2>
        <input
        type="number"
        name="1"
        id="item-quantity"
        min="1"
        max="10"
        value="${quantity}"
        
        />
    </div>
    <h2>${price}</h2>
    <button id="btn-remove">Remove</button>
    
    `;

    const btnRemove = itemEl.querySelector("#btn-remove");
    btnRemove.addEventListener("click", () => {
      const status = removeCartItem(item);
      status.then((rs) => {
        if (rs === "ok") {
          btnRemove.closest(".cart-item").remove();
        }
      });
    });

    cartContentEL.appendChild(itemEl);
  });

  // To remove the cart item from the carts
  async function removeCartItem(item, e) {
    console.log("Remove Item:", item, e);
    const parsedPrice = JSON.parse(item.price);
    const itemId = item.product_id;

    try {
      const resp = await fetch(`http://127.0.0.1:8080/carts/${itemId}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        //Update the total price
        cartTotal = cartTotal - parsedPrice;
        lblTotalEl.textContent = parseFloat(cartTotal).toFixed(2);

        console.log("cart item deleted successfully!");
        return "ok";
      } else {
        throw new Error("Failed to delete cart item!");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  }
}


async function getProductsByID(id) {
  const resp = await fetch("http://127.0.0.1:8080/products/" + id);
  const respData = await resp.json();
  return respData;
}
