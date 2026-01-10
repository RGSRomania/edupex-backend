// Simple authentication middleware for demonstration
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  // Optionally, validate the token here
  // const token = authHeader.split(' ')[1];
  next();
};

