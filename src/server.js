const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const setupAdmin = require("./admin/adminbro.js");
const createAdminUser = require("./admin/createAdminUser.js");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));

// Initialize Admin Panel and start server
(async () => {
  await createAdminUser();

  const { adminJs, router } = await setupAdmin();
  app.use(adminJs.options.rootPath, router);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🛠️ AdminJS available at ${adminJs.options.rootPath}`);
  });
})();
