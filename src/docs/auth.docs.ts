export const authDocs = {
  paths: {
    "/auth/signUp": {
      post: {
        summary: "Register a new merchant user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "test@example.com" },
                  password: { type: "string", example: "StrongPassword123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/auth/signIn": {
      post: {
        summary: "LogIn to Your account",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "test@example.com" },
                  password: { type: "string", example: "StrongPassword123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "SignIn successfull" },
          401: { description: "Invalid credentials" },
        },
      },
    },
  },
};
