import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

//PRODUCTS
// To get all the products from the db
export async function getProducts() {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
}

// To get a product for the given id
export async function getProduct(id) {
  try {
    const [rows] = await pool.query(
      `
          SELECT *
          FROM products
          WHERE product_id = ?
        `,
      [id]
    );

    return rows;
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
}

//To create a product in the db
export async function createProduct(
  name,
  description,
  price,
  quantity,
  manufacturer,
  category,
  image_urls
) {
  try {
    const [result] = await pool.query(
      `
          INSERT INTO products (
            name,
            description,
            price,
            quantity,
            manufacturer,
            category,
            image_urls)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
      [name, description, price, quantity, manufacturer, category, image_urls]
    );

    const id = result.insertId;
    return getProduct(id);
  } catch (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }
}

//To delete a product from the db
export async function deleteProduct(id) {
  try {
    const result = await pool.query(
      `
          DELETE FROM products
          WHERE product_id = ?
          `,
      [id]
    );

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      throw new Error("Product not found");
    }

    return { message: "Product deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
}

//CUSTOMERS
// To get all the customers from the db
export async function getCustomers() {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");
    return rows;
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
}

// To get a customer by id
export async function getCustomer(id) {
  try {
    const [rows] = await pool.query(
      `
          SELECT *
          FROM customers
          WHERE customer_id = ?
        `,
      [id]
    );

    return rows;
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
}

// To get a customer by email
export async function getCustomerByEmail(email) {
  try {
    const [rows] = await pool.query(
      `
          SELECT *
          FROM customers
          WHERE email = ?
        `,
      [email]
    );

    return rows;
  } catch (error) {
    throw new Error(`Error fetching customer: ${error.message}`);
  }
}

// Check user exist in the DB
export async function checkUserCredentials(email, password) {
  try {
    const [rows] = await pool.query(
      `
        SELECT * FROM customers
        WHERE email = ? AND password_hash = ?
      
      `,
      [email, password]
    );

    if(rows.length > 0) {
      return rows[0];
    } else {
      throw new Error('Invalid email or password')
    }
  } catch (error) {
    throw new Error(`Error checking user credentials: ${error.message}`);
    
  }
}



//To add a customer to the db
export async function addCustomer(
  name,
  email,
  password_hash,
  address,
  phone_number
) {
  try {
    const [result] = await pool.query(
      `
          INSERT INTO customers (
            name,
            email,
            password_hash,
            address,
            phone_number)
          VALUES (?, ?, ?, ?, ?)
          `,
      [name, email, password_hash, address, phone_number]
    );

    const id = result.insertId;
    return getCustomer(id);
  } catch (error) {
    throw new Error(`Error adding customer: ${error.message}`);
  }
}

//To remove a customer from the db
export async function removeCustomer(id) {
  try {
    const result = await pool.query(
      `
          DELETE FROM customers
          WHERE customer_id = ?
          `,
      [id]
    );

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }

    return { message: "Customer deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
}

//ORDERS
// To get all the orders from the db
export async function getOrders() {
  try {
    const [rows] = await pool.query("SELECT * FROM orders");
    return rows;
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
}

// To get a order by id
export async function getOrder(id) {
  try {
    const [rows] = await pool.query(
      `
            SELECT *
            FROM orders
            WHERE order_id = ?
          `,
      [id]
    );

    return rows;
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
}

//To add an order to the db
export async function addOrder(customer_id, total_amount, status) {
  try {
    const [result] = await pool.query(
      `
            INSERT INTO orders (
                customer_id, total_amount, status)
            VALUES (?, ?, ?)
            `,
      [customer_id, total_amount, status]
    );

    const id = result.insertId;
    return getOrder(id);
  } catch (error) {
    throw new Error(`Error adding order: ${error.message}`);
  }
}

//To delete a order from the db
export async function deleteOrder(id) {
  try {
    const result = await pool.query(
      `
            DELETE FROM orders
            WHERE order_id = ?
            `,
      [id]
    );

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      throw new Error("Order not found");
    }

    return { message: "Order deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
}

//ADMINS DB CRUD Here...... (If needed)

//ORDER ITEMS CRUD
// To get all the order items from the db
export async function getOrderItems() {
  try {
    const [rows] = await pool.query("SELECT * FROM order_items");
    return rows;
  } catch (error) {
    throw new Error(`Error fetching order items: ${error.message}`);
  }
}

// To get a order items by id
export async function getOrderItem(id) {
  try {
    const [rows] = await pool.query(
      `
              SELECT *
              FROM order_items
              WHERE order_item_id = ?
            `,
      [id]
    );

    return rows;
  } catch (error) {
    throw new Error(`Error fetching order items: ${error.message}`);
  }
}

//To add an order item to the db
export async function addOrderItem(order_id, product_id, quantity, unit_price) {
  try {
    const [result] = await pool.query(
      `
              INSERT INTO order_items (
                order_id, product_id, quantity, unit_price)
              VALUES (?, ?, ?, ?)
              `,
      [order_id, product_id, quantity, unit_price]
    );

    const id = result.insertId;
    return getOrderItem(id);
  } catch (error) {
    throw new Error(`Error adding order item: ${error.message}`);
  }
}

//To delete a order item from the db
export async function deleteOrderItem(id) {
  try {
    const result = await pool.query(
      `
              DELETE FROM order_items
              WHERE order_item_id = ?
              `,
      [id]
    );

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      throw new Error("Order item not found");
    }

    return { message: "Order item deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting order item: ${error.message}`);
  }
}


//CART CRUD
// To get all the cart items from the db
export async function getCartItems() {
  try {
    const [rows] = await pool.query("SELECT * FROM cart");
    return rows;
  } catch (error) {
    throw new Error(`Error fetching cart items: ${error.message}`);
  }
}

// To get a cart item by id
export async function getCartItem(id) {
  try {
    const [rows] = await pool.query(
      `
              SELECT *
              FROM cart
              WHERE cart_id = ?
            `,
      [id]
    );

    return rows;
  } catch (error) {
    throw new Error(`Error fetching cart item: ${error.message}`);
  }
}

//To add a cart item to the db
export async function addCartItem(customer_id, product_id, quantity) {
  try {
    const [result] = await pool.query(
      `
              INSERT INTO cart (
                customer_id, product_id, quantity)
              VALUES (?, ?, ?)
              `,
      [customer_id, product_id, quantity]
    );

    const id = result.insertId;
    return getCartItem(id);
  } catch (error) {
    throw new Error(`Error adding cart item: ${error.message}`);
  }
}

//To delete a cart item from the db
export async function deleteCartItem(id) {
  try {
    const result = await pool.query(
      `
              DELETE FROM cart
              WHERE product_id = ?
              `,
      [id]
    );

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      throw new Error("Cart item not found");
    }

    return { message: "Cart item deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting cart item: ${error.message}`);
  }
}

