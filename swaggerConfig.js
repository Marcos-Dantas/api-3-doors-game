import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sua API',
      version: '1.0.0',
      description: 'Uma descrição simples da sua API',
    },
  },
  apis: ['./src/routers/*.js']
  
};

const swaggerSpecs = swaggerJsdoc(options);
export default swaggerSpecs;