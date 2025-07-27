const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 5050;
const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Also useful if using JSON from frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// GET all users
app.get("/getUsers", async (req, res) => {
    await client.connect(MONGO_URL);
    const db = client.db("apnacollege-db");
    const data = await db.collection("users").find({}).toArray();
    client.close();
    res.send(data);
});

// POST new user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    await client.connect(MONGO_URL);
    const db = client.db("apnacollege-db");
    const result = await db.collection("users").insertOne(userObj);
    client.close();
    res.send({ message: "User added successfully", data: result });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

