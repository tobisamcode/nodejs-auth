require("dotenv").config();

const express = require("express");
const connectDB = require("./database/db");
const authRoutes = require("./routes/auth.route");
const homeRoutes = require("./routes/home.route");
const adminRoutes = require("./routes/admin.route");
const imageRoutes = require("./routes/image.route");

const app = express();

app.use(express.json());
// app.use("/uploads", express.static("uploads")); 

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
