import swaggerJsdoc from "swagger-jsdoc";
import { authDocs } from "../docs/auth.docs";
import { blockchainDocs } from "../docs/blockchain.docs";
import { merchantDocs } from "../docs/merchant.docs";
import { PORT } from '../constants/envConstants';


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crypto Payment Gateway API",
      version: "1.0.0",
      description: "Non-custodial crypto payment confirmation engine",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    paths: {...authDocs.paths, ...blockchainDocs.paths, ...merchantDocs.paths}
  },apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
