# 📘 MTG Prescription API Documentation

This document provides a reference for all API routes available in the MTG Prescription backend, organized by feature and functionality.

---

## 🔐 Authentication Middleware

> All `/api/v1/prescription` routes are protected by `SupabaseProtected()` middleware.  
> Ensure the appropriate token is provided in the `Authorization` header as a Bearer token.

---

## 💊 Prescription Routes

| Method | Endpoint            | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| POST   | `/prescription`     | Create a new prescription                |
| GET    | `/prescription/all` | Fetch all prescriptions                  |
| GET    | `/prescription/:id` | Fetch a single prescription by ID        |
| DELETE | `/prescription`     | Delete multiple prescriptions by ID list |
| PUT    | `/prescription`     | Update multiple prescriptions in batch   |

---

## 🧾 Prescription History Routes

| Method | Endpoint                           | Description                                            |
| ------ | ---------------------------------- | ------------------------------------------------------ |
| POST   | `/prescriptionhistory`             | Create a prescription history record                   |
| GET    | `/prescriptionhistory/all/:email`  | Get all histories associated with a user’s email       |
| GET    | `/prescriptionhistory/:email/:pId` | Get a specific history by email and prescription ID    |
| DELETE | `/prescriptionhistory/:email/:pId` | Delete a specific history by email and prescription ID |
| PUT    | `/prescriptionhistory/:email/:pId` | Update a specific history by email and prescription ID |

---

## 📌 Notes

- All routes follow RESTful conventions.
- Data must be sent and received as JSON.
- Endpoints are subject to authentication and may return `401 Unauthorized` if token validation fails.
- Was recently converted from a microservice architecture to an API so some route urls/logic will be having major changes soon...

---

## 🧰 Coming Soon

---

## 🧑‍💻 Developed By

Tommy Lay  
Made with ❤️ and Go + Fiber
