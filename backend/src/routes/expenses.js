const express = require("express");
const router = express.Router();
const ExpModel = require("../model/ExpenseModel");
const { expenseSchema } = require("../utils/validate");

function getUserId(req) {
  return req.auth?.sub; 
}


router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const expenses = await ExpModel.find({ userId }).sort({ date: -1 });

    res.json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post("/", async (req, res) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = getUserId(req);

    const expense = new ExpModel({
      ...req.body,
      userId,
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = getUserId(req);

    const expense = await ExpModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { ...req.body, userId },
      { new: true }
    );

    if (!expense) return res.status(404).json({ error: "Expense not found" });

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const userId = getUserId(req);

    const expense = await ExpModel.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!expense) return res.status(404).json({ error: "Expense not found" });

    res.json({
      success: true,
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;




