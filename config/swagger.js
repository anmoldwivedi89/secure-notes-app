const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Notes API",
    version: "1.0.0",
    description:
      "API documentation for authentication and notes endpoints. Use the Authorize button to set a Bearer token for protected routes.",
  },
  servers: [
    {
      url: "/api",
      description: "API base path",
    },
  ],
  tags: [
    { name: "Health", description: "Server health check" },
    { name: "Auth", description: "User registration, login, and profile" },
    { name: "Notes", description: "Protected note management endpoints" },
    { name: "Admin", description: "Admin-only endpoints (requires admin role)" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token from login response",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: { type: "string", minLength: 6, example: "secret123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: { type: "string", example: "secret123" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          role: { type: "string", enum: ["user", "admin"], example: "user" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-24T10:00:00.000Z",
          },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User registered successfully" },
          data: {
            type: "object",
            properties: {
              _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-05-24T10:00:00.000Z",
              },
            },
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successful" },
          token: {
            type: "string",
            example:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWYxYTJiM2M0ZDVlNmY3aGFiOWNvZGUiLCJpYXQiOjE3MTY1NDc2MDAsImV4cCI6MTcxNzE1MjQwMH0.example",
          },
          data: { $ref: "#/components/schemas/User" },
        },
      },
      ProfileResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/User" },
        },
      },
      Note: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0e" },
          title: { type: "string", example: "My first note" },
          content: { type: "string", example: "This is the note content" },
          createdBy: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-24T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-05-24T10:30:00.000Z",
          },
        },
      },
      CreateNoteRequest: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "My first note" },
          content: { type: "string", example: "This is the note content" },
        },
      },
      UpdateNoteRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Updated title" },
          content: { type: "string", example: "Updated content" },
        },
      },
      NoteListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          count: { type: "integer", example: 1 },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Note" },
          },
        },
      },
      NoteResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Note created successfully" },
          data: { $ref: "#/components/schemas/Note" },
        },
      },
      DeleteNoteResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Note deleted successfully" },
        },
      },
      GetNoteResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Note" },
        },
      },
      AdminUsersResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          count: { type: "integer", example: 2 },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
    },
  },
  paths: {

    "/health": {
      get: {
        tags: ["Health"],
        summary: "Server health check",
        description: "Returns server status and current timestamp. No authentication required.",
        responses: {
          200: {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Server is running" },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      example: "2026-05-24T07:00:00.000Z",
                    },
                  },
                },
                examples: {
                  healthy: {
                    summary: "Healthy response",
                    value: {
                      success: true,
                      message: "Server is running",
                      timestamp: "2026-05-24T07:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
              examples: {
                register: {
                  summary: "Register user",
                  value: {
                    name: "John Doe",
                    email: "john@example.com",
                    password: "secret123",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterResponse" },
                examples: {
                  success: {
                    summary: "Successful registration",
                    value: {
                      success: true,
                      message: "User registered successfully",
                      data: {
                        _id: "665f1a2b3c4d5e6f7a8b9c0d",
                        name: "John Doe",
                        email: "john@example.com",
                        createdAt: "2026-05-24T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or duplicate email",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingFields: {
                    summary: "Missing fields",
                    value: {
                      success: false,
                      message:
                        "Name is required, Valid email is required, Password must be at least 6 characters",
                    },
                  },
                  duplicateEmail: {
                    summary: "Duplicate email",
                    value: {
                      success: false,
                      message: "User with this email already exists",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              examples: {
                login: {
                  summary: "Login credentials",
                  value: {
                    email: "john@example.com",
                    password: "secret123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
                examples: {
                  success: {
                    summary: "Successful login",
                    value: {
                      success: true,
                      message: "Login successful",
                      token:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWYxYTJiM2M0ZDVlNmY3aGFiOWNvZGUiLCJpYXQiOjE3MTY1NDc2MDAsImV4cCI6MTcxNzE1MjQwMH0.example",
                      data: {
                        _id: "665f1a2b3c4d5e6f7a8b9c0d",
                        name: "John Doe",
                        email: "john@example.com",
                        role: "user",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingFields: {
                    summary: "Missing fields",
                    value: {
                      success: false,
                      message: "Valid email is required, Password is required",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidCredentials: {
                    summary: "Invalid email or password",
                    value: {
                      success: false,
                      message: "Invalid email or password",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get logged-in user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfileResponse" },
                examples: {
                  success: {
                    summary: "User profile",
                    value: {
                      success: true,
                      data: {
                        _id: "665f1a2b3c4d5e6f7a8b9c0d",
                        name: "John Doe",
                        email: "john@example.com",
                        role: "user",
                        createdAt: "2026-05-24T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  noToken: {
                    summary: "No token provided",
                    value: {
                      success: false,
                      message: "Not authorized, no token provided",
                    },
                  },
                  invalidToken: {
                    summary: "Invalid token",
                    value: {
                      success: false,
                      message: "Not authorized, invalid token",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notes": {
      get: {
        tags: ["Notes"],
        summary: "Get logged-in user's notes",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Notes retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NoteListResponse" },
                examples: {
                  success: {
                    summary: "User notes list",
                    value: {
                      success: true,
                      count: 1,
                      data: [
                        {
                          _id: "665f1a2b3c4d5e6f7a8b9c0e",
                          title: "My first note",
                          content: "This is the note content",
                          createdBy: "665f1a2b3c4d5e6f7a8b9c0d",
                          createdAt: "2026-05-24T10:30:00.000Z",
                          updatedAt: "2026-05-24T10:30:00.000Z",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  unauthorized: {
                    summary: "Missing or invalid token",
                    value: {
                      success: false,
                      message: "Not authorized, no token provided",
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Notes"],
        summary: "Create a new note",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateNoteRequest" },
              examples: {
                createNote: {
                  summary: "Create note",
                  value: {
                    title: "My first note",
                    content: "This is the note content",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Note created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NoteResponse" },
                examples: {
                  success: {
                    summary: "Note created",
                    value: {
                      success: true,
                      message: "Note created successfully",
                      data: {
                        _id: "665f1a2b3c4d5e6f7a8b9c0e",
                        title: "My first note",
                        content: "This is the note content",
                        createdBy: "665f1a2b3c4d5e6f7a8b9c0d",
                        createdAt: "2026-05-24T10:30:00.000Z",
                        updatedAt: "2026-05-24T10:30:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingFields: {
                    summary: "Missing fields",
                    value: {
                      success: false,
                      message: "Title is required, Content is required",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  unauthorized: {
                    summary: "Missing or invalid token",
                    value: {
                      success: false,
                      message: "Not authorized, no token provided",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notes/{id}": {
      get: {
        tags: ["Notes"],
        summary: "Get a single note by ID",
        description: "Returns a single note. Only the note owner or an admin can access it.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "665f1a2b3c4d5e6f7a8b9c0e",
          },
        ],
        responses: {
          200: {
            description: "Note retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GetNoteResponse" },
                examples: {
                  success: {
                    summary: "Note found",
                    value: {
                      success: true,
                      data: {
                        _id: "665f1a2b3c4d5e6f7a8b9c0e",
                        title: "My first note",
                        content: "This is the note content",
                        createdBy: "665f1a2b3c4d5e6f7a8b9c0d",
                        createdAt: "2026-05-24T10:30:00.000Z",
                        updatedAt: "2026-05-24T10:30:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid note ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidId: {
                    summary: "Invalid ID format",
                    value: { success: false, message: "Invalid note ID" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  unauthorized: {
                    summary: "Missing or invalid token",
                    value: { success: false, message: "Not authorized, no token provided" },
                  },
                },
              },
            },
          },
          403: {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  forbidden: {
                    summary: "Not owner or admin",
                    value: { success: false, message: "Not authorized to modify this note" },
                  },
                },
              },
            },
          },
          404: {
            description: "Note not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    summary: "Note not found",
                    value: { success: false, message: "Note not found" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Notes"],
        summary: "Update a note",
        description:
          "Only the note owner or an admin can update a note.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "665f1a2b3c4d5e6f7a8b9c0e",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateNoteRequest" },
              examples: {
                updateNote: {
                  summary: "Update note",
                  value: {
                    title: "Updated title",
                    content: "Updated content",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Note updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NoteResponse" },
                examples: {
                  success: {
                    summary: "Note updated",
                    value: {
                      success: true,
                      message: "Note updated successfully",
                      data: {
                        _id: "665f1a2b3c4d5e6f7a8b9c0e",
                        title: "Updated title",
                        content: "Updated content",
                        createdBy: "665f1a2b3c4d5e6f7a8b9c0d",
                        createdAt: "2026-05-24T10:30:00.000Z",
                        updatedAt: "2026-05-24T11:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or invalid note ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidId: {
                    summary: "Invalid note ID",
                    value: {
                      success: false,
                      message: "Invalid note ID",
                    },
                  },
                  missingFields: {
                    summary: "Missing update fields",
                    value: {
                      success: false,
                      message: "Please provide title or content to update",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  unauthorized: {
                    summary: "Missing or invalid token",
                    value: {
                      success: false,
                      message: "Not authorized, no token provided",
                    },
                  },
                },
              },
            },
          },
          403: {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  forbidden: {
                    summary: "Not owner or admin",
                    value: {
                      success: false,
                      message: "Not authorized to modify this note",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Note not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    summary: "Note not found",
                    value: {
                      success: false,
                      message: "Note not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Notes"],
        summary: "Delete a note",
        description: "Only the note owner or an admin can delete a note.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "665f1a2b3c4d5e6f7a8b9c0e",
          },
        ],
        responses: {
          200: {
            description: "Note deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteNoteResponse" },
                examples: {
                  success: {
                    summary: "Note deleted",
                    value: {
                      success: true,
                      message: "Note deleted successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid note ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidId: {
                    summary: "Invalid note ID",
                    value: {
                      success: false,
                      message: "Invalid note ID",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  unauthorized: {
                    summary: "Missing or invalid token",
                    value: {
                      success: false,
                      message: "Not authorized, no token provided",
                    },
                  },
                },
              },
            },
          },
          403: {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  forbidden: {
                    summary: "Not owner or admin",
                    value: {
                      success: false,
                      message: "Not authorized to modify this note",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Note not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    summary: "Note not found",
                    value: {
                      success: false,
                      message: "Note not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users (admin only)",
        description: "Returns a list of all registered users. Requires admin role.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of all users",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminUsersResponse" },
                examples: {
                  success: {
                    summary: "All users",
                    value: {
                      success: true,
                      count: 2,
                      data: [
                        {
                          _id: "665f1a2b3c4d5e6f7a8b9c0d",
                          name: "John Doe",
                          email: "john@example.com",
                          role: "user",
                          createdAt: "2026-05-24T10:00:00.000Z",
                        },
                        {
                          _id: "665f1a2b3c4d5e6f7a8b9c0f",
                          name: "Admin User",
                          email: "admin@example.com",
                          role: "admin",
                          createdAt: "2026-05-23T08:00:00.000Z",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  unauthorized: {
                    summary: "Missing or invalid token",
                    value: { success: false, message: "Not authorized, no token provided" },
                  },
                },
              },
            },
          },
          403: {
            description: "Forbidden – admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  forbidden: {
                    summary: "Not an admin",
                    value: { success: false, message: "Not authorized, admin access required" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
