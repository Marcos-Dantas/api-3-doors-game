import express from 'express';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../swaggerConfig.js';
import YAML from 'yamljs';
import path from 'path';
const swaggerDocument = YAML.load(
  path.join(process.cwd(), 'src', 'swagger', 'swaggerDocument.yaml'),
);

const PORT = 3000;
var app = express();

// Rota para documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

routes(app);

export default app;
