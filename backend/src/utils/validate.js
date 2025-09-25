const Joi = require("joi");

const expenseSchema = Joi.object({
  type: Joi.string().valid("Income", "Expense").required(),
  title: Joi.string().min(2).max(100).required(),
  amount: Joi.number().positive().required(),
  category: Joi.string()
    .valid("Food", "Transport", "Shopping", "Bills", "Income", "Other")
    .required(),
  date: Joi.date().required(),
  notes: Joi.string().allow("", null).optional(),
});

module.exports = { expenseSchema };

