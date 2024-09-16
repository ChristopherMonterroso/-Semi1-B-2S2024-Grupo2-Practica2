// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db").connectDB;
const { db } = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const textRoutes = require("./routes/textRoutes"); 
const albumRoutes = require("./routes/albumRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", textRoutes);
app.use("/api", albumRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Node.js server running on port 5000");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await db.sync();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();
