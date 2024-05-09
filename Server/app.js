import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Secret key for JWT token signing
const secretKey = "dilmah";

import { getProducts, getProduct, createProduct, deleteProduct } from "./db.js";
import {
  getCustomers,
  getCustomer,
  addCustomer,
  removeCustomer,
} from "./db.js";
import { getOrders, getOrder, addOrder, deleteOrder } from "./db.js";

import {
  getCartItems,
  getCartItem,
  addCartItem,
  deleteCartItem,
} from "./db.js";

import { checkUserCredentials } from "./db.js";
import {getCustomerByEmail}  from "./db.js";

import { get } from "https";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Products API
// to get all the notes from the db
app.get("/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To get a single product by the id
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProduct(id);
    res.send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//To push a product to the db
app.post("/products", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      manufacturer,
      category,
      image_urls,
    } = req.body;
    const product = await createProduct(
      name,
      description,
      price,
      quantity,
      manufacturer,
      category,
      image_urls
    );
    res.status(201).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To delete a product by id
app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer API
// to get all the customers from the db
app.get("/customers", async (req, res) => {
  try {
    const customers = await getCustomers();
    res.send(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To get a single customer by the id
app.get("/customers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await getCustomer(id);
    res.send(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To get a customer by the email
app.get("/users/:email", async (req, res) => {
  try {
    console.log();
    const email = req.params.email;
    console.log(email);
    const customer = await getCustomerByEmail(email);
    res.send(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To check user exist in the DB
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Call the fn to check the user existing in the DB
    const user = await checkUserCredentials(email, password);

    // If user exist, generate a token
    const token = jwt.sign({ userId: user.customer_id }, secretKey, {
      expiresIn: "1h",
    });

    // Return the token in the response
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//To add a customer to the db
app.post("/customers", async (req, res) => {
  try {
    const { name, email, password_hash, address, phone_number } = req.body;
    const customer = await addCustomer(
      name,
      email,
      password_hash,
      address,
      phone_number
    );
    res.status(201).send(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To delete a customer by id
app.delete("/customers/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await removeCustomer(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order API
// to get all the orders from the db
app.get("/orders", async (req, res) => {
  try {
    const orders = await getOrders();
    res.send(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To get a single order by the id
app.get("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await getOrder(id);
    res.send(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//To add an order to the db
app.post("/orders", async (req, res) => {
  try {
    const { customer_id, total_amount, status } = req.body;
    const order = await addOrder(customer_id, total_amount, status);
    res.status(201).send(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To delete a order by id
app.delete("/orders/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteOrder(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CART API
// to get all the cart item from the db
app.get("/carts", async (req, res) => {
  try {
    const carts = await getCartItems();
    res.send(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To get a single cart item by the id
app.get("/carts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await getCartItem(id);
    res.send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//To add an cart item to the db
app.post("/carts", async (req, res) => {
  try {
    const { customer_id, product_id, quantity } = req.body;
    const cart = await addCartItem(customer_id, product_id, quantity);
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To delete a cart item by id
app.delete("/carts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteCartItem(id);
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// COMMON
//To handle the exception
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//to start the app on the 8080 port
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
