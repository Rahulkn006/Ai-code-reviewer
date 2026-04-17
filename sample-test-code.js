// ============================================
// E-Commerce Shopping Cart System
// Sample Code for AI Code Review Testing
// ============================================

const mysql = require('mysql');

// ISSUE: Hardcoded database credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'ecommerce'
});

// ISSUE: No input validation, SQL injection vulnerability
function getUser(userId) {
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  return db.query(query);
}

// ISSUE: Storing passwords in plain text
async function registerUser(username, password, email) {
  const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
  db.query(query);
  return { success: true, message: "User registered" };
}

// ISSUE: No authentication/authorization check
function deleteUser(userId) {
  db.query("DELETE FROM users WHERE id = " + userId);
  return { deleted: true };
}

// Shopping Cart Class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.discount = 0;
  }

  // ISSUE: No validation on quantity, could be negative
  addItem(product, quantity, price) {
    this.items.push({
      product: product,
      quantity: quantity,
      price: price
    });
  }

  // ISSUE: Floating point arithmetic for money
  calculateTotal() {
    let total = 0;
    for (var i = 0; i < this.items.length; i++) {
      total = total + this.items[i].price * this.items[i].quantity;
    }
    total = total - (total * this.discount / 100);
    return total;
  }

  // ISSUE: No bounds checking, returns undefined silently
  getItem(index) {
    return this.items[index];
  }

  // ISSUE: Modifying array while iterating
  removeExpiredItems() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].expired) {
        this.items.splice(i, 1);
      }
    }
  }

  // ISSUE: eval() usage - Remote Code Execution risk
  applyPromoCode(code) {
    const discount = eval(code);
    this.discount = discount;
  }
}

// ISSUE: Callback hell, no error handling
function processOrder(cart, userId, callback) {
  getUser(userId, function(err, user) {
    db.query("INSERT INTO orders ...", function(err, order) {
      sendEmail(user.email, function(err, result) {
        updateInventory(cart.items, function(err, inv) {
          callback(null, { success: true });
        });
      });
    });
  });
}

// ISSUE: Race condition in payment processing
let paymentProcessing = false;
async function processPayment(amount, cardNumber) {
  if (paymentProcessing) return;
  paymentProcessing = true;
  
  // ISSUE: Logging sensitive data
  console.log("Processing payment for card: " + cardNumber);
  
  try {
    // ISSUE: No HTTPS check, sending card data
    const response = await fetch('http://payment-api.com/charge', {
      method: 'POST',
      body: JSON.stringify({ amount, cardNumber })
    });
    return response.json();
  } catch(e) {
    // ISSUE: Swallowing errors
    return null;
  } finally {
    paymentProcessing = false;
  }
}

// ISSUE: Prototype pollution vulnerability
function mergeConfig(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      target[key] = target[key] || {};
      mergeConfig(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ISSUE: Insecure random token generation
function generateSessionToken() {
  return Math.random().toString(36).substring(2);
}

// ISSUE: XSS vulnerability
function renderUserProfile(user) {
  document.getElementById('profile').innerHTML = 
    '<h1>' + user.name + '</h1>' +
    '<p>' + user.bio + '</p>';
}

// ISSUE: Memory leak - event listeners never removed
function initializeApp() {
  setInterval(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => {
        data.forEach(notification => {
          document.addEventListener('click', () => {
            alert(notification.message);
          });
        });
      });
  }, 5000);
}

// ISSUE: Regex DoS (ReDoS) vulnerability
function validateEmail(email) {
  const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
  return regex.test(email);
}

// ISSUE: Timing attack vulnerability in password comparison
function checkPassword(input, stored) {
  if (input.length !== stored.length) return false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== stored[i]) return false;
  }
  return true;
}

// ISSUE: IDOR - Insecure Direct Object Reference
app.get('/api/invoice/:id', (req, res) => {
  const invoice = db.query('SELECT * FROM invoices WHERE id = ' + req.params.id);
  res.json(invoice);
});

// ISSUE: Open redirect vulnerability
app.get('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

// ISSUE: No rate limiting on login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser(username);
  if (user && user.password === password) {
    res.json({ token: generateSessionToken() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = { ShoppingCart, processOrder, processPayment };
