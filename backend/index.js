require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker Backend Running 🚀" });
});



try {
  const expenseRoutes = require("./src/routes/expenses");
  const checkJwt = require("./src/middleware/auth");

  app.use("/api/expenses", checkJwt, expenseRoutes);
  console.log("✅ Protected routes loaded successfully");

} catch (error) {
  console.error("⚠️ Error loading routes:", error.message);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});









































// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err.message);

//   if (err.name === 'UnauthorizedError') {
//     return res.status(401).json({ 
//       error: 'Access denied. Invalid ',
//       details: err.message
//     });
//   }

//   res.status(500).json({ error: 'Something went wrong!' });
// });


