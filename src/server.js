import express from "express";
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../swaggerConfig.js';

// Rota para documentação
const PORT = 3000;
var app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

routes(app);

export default app;
