import { body, param, validationResult } from "express-validator";

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration rules
export const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),
  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
  body("address").optional().trim().isLength({ max: 255 }),
  body("city").optional().trim().isLength({ max: 100 }),
  body("pincode").optional().isPostalCode("IN").withMessage("Invalid pincode"),
];

// Login rules
export const loginRules = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Product rules
export const addProductRules = [
  body("product_name").trim().notEmpty().withMessage("Product name is required").isLength({ max: 255 }),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock_quantity")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("image").optional().trim().isURL().withMessage("Image must be a valid URL"),
];

// Cart rules
export const addToCartRules = [
  body("product_id").isInt({ min: 1 }).withMessage("Valid product ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

// Param ID rule
export const idParamRule = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];