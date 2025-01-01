import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
      openapi: '3.0.0', // Specify the version of OpenAPI
      info: {
        title: 'NTC Inter-Provincial Bus Seat Reservation System',
        version: '1.0.0',
        description: 'API documentation with Swagger which used real-time inter-provincial bus seats reservation in NTC',
      },
      servers: [
        {
          url: 'https://ntcbusreservation.me/', // API server URL
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to the route files
  };

  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  export {swaggerUi,swaggerDocs};