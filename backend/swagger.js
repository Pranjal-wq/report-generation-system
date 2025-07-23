// docs/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Backend API Documentation',
    version: '1.0.0',
    description: 'API documentation for the backend system.',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Change this to your production or local URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/FacultyReport/facultyReport.controller.js'], // Path to your controllers
};

export const swaggerSpec = swaggerJSDoc(options);
