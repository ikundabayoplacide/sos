import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "SOS Medical API",
        version: "1.0.0",
        description: "API documentation for SOS Medical appointment system"
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    fullName: { type: "string" },
                    email: { type: "string" },
                    phoneNUmber: { type: "string" },
                    role: { type: "string", enum: ["patient", "doctor", "admin"] },
                    date_of_birth: { type: "string", format: "date" },
                    gender: { type: "string", enum: ["male", "female", "others"] },
                    profile_image: { type: "string" },
                    status: { type: "string", enum: ["active", "inactive", "blocked"] },
                    emergency_contact: { type: "string" },
                    location: { type: "string" }
                }
            },
            Appointment: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    patientId: { type: "string", format: "uuid" },
                    doctorId: { type: "string", format: "uuid" },
                    appointmentDate: { type: "string", format: "date-time" },
                    reason: { type: "string" },
                    status: { type: "string", enum: ["pending", "confirmed", "rejected", "cancelled"] },
                    notes: { type: "string" }
                }
            },
            DoctorAvailability: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    doctorId: { type: "string", format: "uuid" },
                    dayOfWeek: { type: "string", example: "Monday" },
                    isAvailable: { type: "boolean" }
                }
            },
            Notification: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    userId: { type: "string", format: "uuid" },
                    title: { type: "string" },
                    message: { type: "string" },
                    type: { type: "string" },
                    isRead: { type: "boolean" }
                }
            }
        }
    },
    security: [{ bearerAuth: [] }],
    tags: [
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Users", description: "User management endpoints" },
        { name: "Availability", description: "Doctor availability management" },
        { name: "Appointments", description: "Appointment booking and management" },
        { name: "Notifications", description: "User notifications" }
    ],
    paths: {
        // ─── AUTH ───────────────────────────────────────────────
        "/api/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fullName", "email", "password", "role"],
                                properties: {
                                    fullName: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" },
                                    phoneNUmber: { type: "string" },
                                    role: { type: "string", enum: ["patient", "doctor", "admin"] },
                                    date_of_birth: { type: "string", format: "date" },
                                    gender: { type: "string", enum: ["male", "female", "others"] },
                                    location: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "User account created successfully" },
                    404: { description: "User already exists" }
                }
            }
        },
        "/api/login": {
            post: {
                tags: ["Auth"],
                summary: "Login and get JWT token",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Login successful, returns JWT token" },
                    401: { description: "Invalid credentials" },
                    404: { description: "User not found" }
                }
            }
        },

        // ─── USERS ──────────────────────────────────────────────
        "/api/getAllUsers": {
            get: {
                tags: ["Users"],
                summary: "Get all users",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of all users" }
                }
            }
        },
        "/api/createUser": {
            post: {
                tags: ["Users"],
                summary: "Create a new user",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fullName", "email", "password"],
                                properties: {
                                    fullName: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" },
                                    role: { type: "string", enum: ["patient", "doctor", "admin"] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "User registered successfully" },
                    400: { description: "Email already in use" }
                }
            }
        },
        "/api/getSingleUser/{id}": {
            get: {
                tags: ["Users"],
                summary: "Get a single user by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "User found" },
                    404: { description: "User not found" }
                }
            }
        },
        "/api/updateUser/{id}": {
            put: {
                tags: ["Users"],
                summary: "Update a user by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    fullName: { type: "string" },
                                    email: { type: "string" },
                                    phoneNUmber: { type: "string" },
                                    location: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "User updated successfully" },
                    404: { description: "User not found" }
                }
            }
        },
        "/api/removeUser/{id}": {
            delete: {
                tags: ["Users"],
                summary: "Delete a user by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "User deleted successfully" },
                    404: { description: "User not found" }
                }
            }
        },

        // ─── AVAILABILITY ────────────────────────────────────────
        "/api/availability": {
            post: {
                tags: ["Availability"],
                summary: "Doctor sets an availability slot",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["dayOfWeek"],
                                properties: {
                                    dayOfWeek: { type: "string", example: "Monday" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Availability set successfully" },
                    400: { description: "Availability for this day already exists" }
                }
            }
        },
        "/api/availability/doctors": {
            get: {
                tags: ["Availability"],
                summary: "Get all doctors with their available slots",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of doctors with availability" }
                }
            }
        },
        "/api/availability/{id}": {
            put: {
                tags: ["Availability"],
                summary: "Doctor updates an availability slot",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    dayOfWeek: { type: "string" },
                                    isAvailable: { type: "boolean" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Availability updated" },
                    404: { description: "Slot not found" }
                }
            },
            delete: {
                tags: ["Availability"],
                summary: "Doctor deletes an availability slot",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Availability slot deleted" },
                    404: { description: "Slot not found" }
                }
            }
        },
        "/api/availability/{doctorId}": {
            get: {
                tags: ["Availability"],
                summary: "Get available slots for a specific doctor",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "doctorId", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Doctor availability slots" },
                    404: { description: "Doctor not found" }
                }
            }
        },

        // ─── APPOINTMENTS ────────────────────────────────────────
        "/api/appointments": {
            post: {
                tags: ["Appointments"],
                summary: "Patient books an appointment by selecting a doctor's availability slot",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["availabilitySlotId", "appointmentDate"],
                                properties: {
                                    availabilitySlotId: {
                                        type: "string",
                                        format: "uuid",
                                        description: "The ID of the doctor's availability slot the patient is selecting"
                                    },
                                    appointmentDate: {
                                        type: "string",
                                        format: "date",
                                        example: "2025-07-21",
                                        description: "The specific date the patient wants. Must match the slot's day of week"
                                    },
                                    reason: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Appointment booked successfully" },
                    400: { description: "Slot not available or already booked" }
                }
            }
        },
        "/api/appointments/patient": {
            get: {
                tags: ["Appointments"],
                summary: "Patient gets their own appointments",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of patient appointments" }
                }
            }
        },
        "/api/appointments/doctor": {
            get: {
                tags: ["Appointments"],
                summary: "Doctor gets their own appointments",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of doctor appointments with patient details" }
                }
            }
        },
        "/api/appointments/all": {
            get: {
                tags: ["Appointments"],
                summary: "Admin gets all appointments",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "All appointments" }
                }
            }
        },
        "/api/appointments/{id}": {
            get: {
                tags: ["Appointments"],
                summary: "Get a single appointment",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Appointment found" },
                    404: { description: "Appointment not found" }
                }
            },
            put: {
                tags: ["Appointments"],
                summary: "Doctor confirms, rejects or adds notes to an appointment",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", enum: ["confirmed", "rejected"] },
                                    notes: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Appointment updated" },
                    404: { description: "Appointment not found" }
                }
            }
        },
        "/api/appointments/{id}/cancel": {
            patch: {
                tags: ["Appointments"],
                summary: "Patient cancels their appointment",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Appointment cancelled" },
                    400: { description: "Only pending appointments can be cancelled" },
                    404: { description: "Appointment not found" }
                }
            }
        },

        // ─── NOTIFICATIONS ───────────────────────────────────────
        "/api/notifications": {
            get: {
                tags: ["Notifications"],
                summary: "Get all notifications for logged-in user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of notifications" }
                }
            }
        },
        "/api/notifications/{id}/read": {
            patch: {
                tags: ["Notifications"],
                summary: "Mark a single notification as read",
                security: [{ bearerAuth: [] }],
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Notification marked as read" },
                    404: { description: "Notification not found" }
                }
            }
        },
        "/api/notifications/read-all": {
            patch: {
                tags: ["Notifications"],
                summary: "Mark all notifications as read",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "All notifications marked as read" }
                }
            }
        }
    }
};

const swaggerSpec = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });
export default swaggerSpec;
