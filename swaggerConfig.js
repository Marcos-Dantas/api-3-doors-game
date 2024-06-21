import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API-3DOORS-GAME',
      version: '1.0.0',
      description: 'Nossa API que faz o cadastro dos usuários, e serve como uma interface entre o nosso jogo e a nossa landing page.',
    },
  },
  servers: [
    {
      url: "https://api-3-doors-game.vercel.app/",
      description: "Nossa API que faz o cadastro dos usuários, e serve como uma interface entre o nosso jogo e a nossa landing page.",
    },
  ],
  apis: ['./src/routes/*.js']
  
};

const swaggerSpecs = swaggerJsdoc(options);
export default swaggerSpecs;