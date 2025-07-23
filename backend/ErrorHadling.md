# Error Handling in AttendanceReport2

This project uses a robust and centralized error handling mechanism to ensure that all errors are caught and processed in a consistent way. Here’s how the error handling works:

---

## 1. asyncWrap Utility

- **Purpose:**  
  The `asyncWrap` function is used to wrap async route handlers and middleware.
- **How it works:**  
  It catches any errors thrown in async functions and automatically forwards them to Express’s error handling middleware using `next(error)`.  
  This removes the need for repetitive try/catch blocks in your route handlers.

---

## 2. Custom ApplicationError Class

- **Purpose:**  
  The `ApplicationError` class extends the standard `Error` class and allows you to throw errors with a custom message and HTTP status code.
- **How it works:**  
  You can throw `new ApplicationError("message", 400)` in your code to signal a specific error with a status code.  
  These errors are recognized and handled specially by the global error handler.

---

## 3. Global Error Handler Middleware

- **Purpose:**  
  The `errorHandler` middleware processes all errors passed to it and sends appropriate HTTP responses.
- **How it works:**  
  - **JSON Parsing Errors:**  
    If the error is a JSON parsing error (e.g., invalid JSON in the request body), it returns a 400 status with the message "Invalid request".
  - **Custom Application Errors:**  
    If the error is an `ApplicationError`, it uses the error’s code and returns a generic message.
  - **404 and 401 Errors:**  
    If the error is a 404 (Not Found) or 401 (Unauthorized), it returns the corresponding status and message.
  - **Other Errors:**  
    For all other errors, it logs the error (in non-production environments) and returns a 500 status with a generic message.

---

## Error Handling Flow

1. **Route Handler:**  
   Async route handlers are wrapped with `asyncWrap`. If an error occurs, it is automatically passed to the error handler.

2. **Throwing Errors:**  
   You can throw `ApplicationError` for custom errors with specific status codes. Other errors (e.g., syntax errors, unhandled exceptions) are also caught.

3. **Global Error Handler:**  
   All errors are processed by `errorHandler.js`. The client receives a consistent error response format, and sensitive error details are not exposed.

---

## Summary

This setup ensures that all errors—whether from async code, custom application logic, or unexpected exceptions—are caught and handled in a centralized way. This provides clear and safe error responses to the client, making the API robust and easier to maintain.
