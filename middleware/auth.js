import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
