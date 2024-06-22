import jwt from 'jsonwebtoken';

export const verifyApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey) {
      return res.status(403).json({ error: 'API Key não fornecida' });
    }
  
    if (apiKey != process.env.API_KEY) {
      return res.status(401).json({ error: 'API Key inválida' });
    }
    // console.log(apiKey)
    // console.log(process.env.API_KEY)
  
    next();
};

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(403).json({ error: 'Token não fornecido' });
    }
    
    // console.log(token)
    // console.log(process.env.SECRET_KEY)
    try {
      const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY); // O token pode vir com o prefixo "Bearer "
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
};