import jwt from "jsonwebtoken";

// 🔐 AUTHENTICATE USER
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = {
  user_id: decoded.user_id,
  role: decoded.role,
  email: decoded.email
};

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
export const admin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    if (req.user.role !== "admin") {
  return res.status(403).json({ error: "Admin access only" });
}

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// 🔒 ADMIN CHECK
