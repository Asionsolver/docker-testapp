const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;

// Middleware fixes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGO_URL =
  "mongodb://admin:qwerty@localhost:27017/docker-db?authSource=admin";

let db;
let client;

// Database connection
async function connectDB() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("docker-db");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    const data = await db.collection("users").find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server error");
  }
});

// POST new user - FIXED
app.post("/addUser", async (req, res) => {
  try {
    const userObj = req.body;
    console.log("Received data:", userObj);

    const result = await db.collection("users").insertOne(userObj);
    console.log("Data inserted in DB:", result);

    // Success response - page redirect
    res.send(`
      <html>
        <body>
          <h2>User created successfully!</h2>
          <p>User ID: ${result.insertedId}</p>
          <a href="/">Go Back</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
