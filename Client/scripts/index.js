// import bcrypt from 'bcryptjs';

const APIURL = "http://localhost:8080/products";

const productContainerEL = document.querySelector(".product-container");
const popupEl = document.querySelector(".user-popup");
const userBtn = document.getElementById("user-btn");
const closeBtnEl = document.getElementById("close-icon");
const registerEl = document.getElementById("lbl-register");
const popupContentEl = document.querySelector(".popup-content");
const popupDescEl = document.querySelector(".popup-desc");
const statusEl = document.getElementById('login-status');
const qPopupContainerEl = document.querySelector(".q-popup-container");
const qPopupCloseEl = document.querySelector(".q-close");
const qInputEl = document.getElementById("quantity-input");
const btnAddToCart = document.getElementById("btn-addToCart");



document.addEventListener('DOMContentLoaded', checkLogInStatus);


// Check login status
function checkLogInStatus() {
  const token = localStorage.getItem('token');
  const customerId = localStorage.getItem('customerId');

  if(token && customerId) {
    showLoginStatus();
  } else {
    hideLoginStatus();
  }
}


// Function to render login section to the popup panel
function renderLogin() {
  // Cleaning the container
  popupDescEl.innerHTML = "";

  // Creating an element for the render
  const loginEl = document.createElement("div");
  loginEl.classList.add(".popup-desc");

  loginEl.innerHTML = `
  
  <h2 class="lbl-greet">Welcome Back!</h2>
  
  
   <div class="login-form" >
    <label for="email">Email</label>
    <input id="email" type="email" required >
    <label for="password">Password</label>
    <input id="password" type="password" required>
    <button id="btn-login" type="submit">Log In</button>
  </div> 

  <p>Don't you have an account? <a id="lbl-register" href="#"><span>Register</span></a></p>
  
  `;

  // Handle user login
  const btnLogin = loginEl.querySelector("#btn-login");
  btnLogin.addEventListener("click", () => {
    loginUser();
  });

  // Handle resgiter button click event
  const lblRegsiter = loginEl.querySelector("#lbl-register");
  lblRegsiter.addEventListener("click", () => {
    renderRegistration();
  });

  popupDescEl.appendChild(loginEl);
}

// Function to render Registration section to the popup panel
function renderRegistration() {
  popupDescEl.innerHTML = "";

  const popupDesc = document.createElement("div");
  popupDesc.classList.add(".popup-desc");

  popupDesc.innerHTML = `
  <h2 class="lbl-greet">Create an account</h2>
            
  <div class="registration-form"  >
    <label for="name">Name</label>
    <input id="name" type="text" required >
    <label for="email">Email</label>
    <input id="email" type="email" required >
    <label for="password">Password</label>
    <input id="password-1" type="password" required >
    <label for="password">Confirm Password</label>
    <input id="password-2" type="password" required >
    <label for="address">Address</label>
    <input id="address" type="text" required>
    <label for="phone">Phone</label>
    <input id="phone" type="text" required>
    <button id="btn-register" type="submit">Register</button>
  </div>

  <p>Have an account? <a id="lbl-login" href="#"><span>Login</span></a></p>
  
  `;

  // When user clicked login-btn renderLogin()
  const lblLogin = popupDesc.querySelector("#lbl-login");
  lblLogin.addEventListener("click", () => {
    renderLogin();
  });

  // Handle registration event click
  const btnRegister = popupDesc.querySelector("#btn-register");
  btnRegister.addEventListener("click", () => {
    registerUser();
  });

  popupDescEl.appendChild(popupDesc);
}

// Handling userBtn event listener
userBtn.addEventListener("click", () => {
  renderLogin();
  popupEl.style.display = "flex";
});

// Handling closeBtnEl event listener
closeBtnEl.addEventListener("click", () => {
  popupEl.style.display = "none";
});

getProducts(APIURL);

// Generate password Hash
async function generatePasswordHash(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.Error("Error generating password hash: ", error);
    throw error;
  }
}

// Handle the user Login
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const resp = await fetch("http://127.0.0.1:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });

    if (resp.ok) {
      const data = await resp.json();
      localStorage.setItem("token", data.token);
      
      // Fetch cutomer data after successful login
      console.log(email);
      const customerResponse = await fetch(`http://127.0.0.1:8080/users/${email}`);
      if(customerResponse.ok) {
        const customerData =  await customerResponse.json();
        const flatData = customerData[0];
        localStorage.setItem('customerId', flatData.customer_id);
      }
      
      console.log("Login successful");
      alert("Login Successful");
      
      popupEl.style.display = "none";
      showLoginStatus();

    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

// Show Login Status
function showLoginStatus() {
  statusEl.style.display = "block";
}


// Function to hide login status
function hideLoginStatus() {
  statusEl.style.display = "none";
}

// Handle signout event
document.getElementById('btn-signout').addEventListener('click', () => {
  logOut();
  hideLoginStatus();
}) 



// Handle the user registration
async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password_1 = document.getElementById("password-1").value;
  const password_2 = document.getElementById("password-2").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  // Compare the passwords matched
  if (password_1 !== password_2) {
    console.log("Password mismatched!");
    return;
  }

  // Generate password hash
  // const password_hash = await generatePasswordHash(password_1);
  const password_hash = password_1;
  try {
    const resp = await fetch("http://127.0.0.1:8080/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password_hash, address, phone }),
    });

    if (resp.ok) {
      alert("Registration successful");
      renderLogin();
    } else {
      throw new Error("Registartion failed");
    }
  } catch (error) {
    console.Error("Error registering: ", error);
  }
}

// Function to Logout
function logOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('customerId')
  console.log('Logged out!');
}


async function getProducts(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  console.log(respData);
  renderProducts(respData);
}


// Function to render Quantity Popup
function renderQPopup() {
  qPopupContainerEl.style.display = 'flex'; 
}

// Handle Q Popup Close Event 
qPopupCloseEl.addEventListener('click', () => {
  qPopupContainerEl.style.display = 'none'; 
})

// Add product to cart 
async function addProductToCart(product) {
  try {
    console.log(product);
    const productId = product.product_id;
    const quantityValue = parseInt(qInputEl.value);
    const resp = await fetch(`http://127.0.0.1:8080/carts/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({quantityValue})
    });
    
    if(resp.ok) {
      const data = await resp.json();
      console.log('Item added to cart: ', data);
      qPopupContainerEl.style.display = 'none'; 
    } else {
      throw new Error('Failed to add item to cart');
    }
    
  } catch (error) {
    console.error('Error adding item to cart: ', error);
  }
}






// Rendering Products to the product container
function renderProducts(products) {
  productContainerEL.innerHTML = "";

  products.forEach((product) => {
    const { image_url, name, quantity, manufacturer, price } = product;

    console.log(product);
    const productEl = document.createElement("div");
    productEl.classList.add("product-item");

    productEl.innerHTML = `
    <img src="${image_url}" alt="${name}">
          <h2>${name}</h2>
          <h3>${manufacturer}</h3>
          <span class="lbl-stock">${quantity} In Stock</span>
          <div class="card-row">
            <h2>${price}</h2>
            <button id="btn-addCart">Add to Cart</button>
          </div>
    `;

    const addCartBtn = productEl.querySelector("#btn-addCart");
    addCartBtn.addEventListener("click", () => {
      const loggedIn = checkLoggedIn();
      if (loggedIn) {
        // Render quantity popup
        renderQPopup();
        btnAddToCart.addEventListener('click', () => {
          addToCart(product);
          qPopupContainerEl.style.display = 'none'; 
        });
      } else {
        // Display login panel
        renderLogin();
        popupEl.style.display = "flex";
      }

      
    });

    productContainerEL.appendChild(productEl);
  });

  // Check the user loggedIn or not
  function checkLoggedIn() {
    const token = localStorage.getItem("token");
    return token !== null;
  }

  async function addToCart(product) {
    try {
      const customerId = localStorage.getItem('customerId');
      const productID = product.product_id;
      const quantity = parseInt(qInputEl.value);
      console.log("Quantity entered: ",quantity);

      const resp = await fetch("http://127.0.0.1:8080/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId, //TODO: Add a Login or Registration to get the user
          product_id: productID,
          quantity: quantity, //TODO: Ask how quantity do they want by throwing a flying UI
        }),
      });

      if (resp.ok) {
        console.log("Product added to cart successfully!");

      } else {
        throw new Error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }
}
