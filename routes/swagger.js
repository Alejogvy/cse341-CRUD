const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Options for Swagger UI to send credentials (cookies)
const swaggerUiOptions = {
  swaggerOptions: {
    requestInterceptor: (req) => {
      req.withCredentials = true;
      return req;
    }
  }
};

// Protects documentation or can be disabled for testing.
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

module.exports = router;
