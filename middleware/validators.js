export const validateRegister = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) return res.status(400).json({ error: "Invalid input" });
  next();
};
export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Invalid input" });
  next();
};
