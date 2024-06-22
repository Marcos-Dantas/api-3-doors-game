import express from "express";
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../swaggerConfig.js';

// CDN CSS
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css";

const PORT = 3000;
var app = express();

// Rota para documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { customCssUrl: CSS_URL }));
// app.use(
//   "/api-docs",
//   swaggerUI.serve,
//   swaggerUI.setup(specs, { customCssUrl: CSS_URL })
// );

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

routes(app);

export default app;
