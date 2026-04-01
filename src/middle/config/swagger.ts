import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PokéSynergy API',
      version: '1.0.0',
      description: 'Documentation interactive de l\'API PokéSynergy',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur Local',
      },
    ],
  },
  // ATTENTION : Le chemin est relatif à la racine où le projet est lancé
  apis: ['./src/middle/*.ts', './src/middle/routes/*.ts'], 
};

export const swaggerDocs = swaggerJsdoc(options);