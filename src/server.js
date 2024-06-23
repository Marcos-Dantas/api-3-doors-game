import express from 'express';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';

const swaggerDocument = YAML.load(
  path.join(process.cwd(), 'src', 'swagger', 'swaggerDocument.yaml'),
);

// CDN CSS NECESSARIO PARA CARREGAR O SWAGGER EM PRODUÇÃO
const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css';

const PORT = 3000;
var app = express();

// Rota para documentação
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL }),
);

// cors adicionado apenas para testar das rotas do frontend
app.use(cors())

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

routes(app);

export default app;
