import { ApplicationError } from "../errorHandle/error.js";

/**
 * Global error handling middleware for the application
 * Processes different types of errors and sends appropriate responses
 */
export default function errorHandler(err, req, res, next) {
  // Handle JSON parsing errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "err",
      message: "Invalid request",
      data: {}
    });
  }

  // Handle 404 Not Found errors
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({
      status: "err",
      message: "Resource not found",
      data: {}
    });
  }

  // Handle 401 Unauthorized errors
  if (err.status === 401 || err.statusCode === 401) {
    return res.status(401).json({
      status: "err",
      message: "Unauthorized",
      data: {}
    });
  }

  if (err.status === 500 || err.statusCode === 500) {
    return res.status(401).json({
      status: "err",
      message: "Internal server error",
      data: {}
    });
  }

  // Handle custom application errors with generic message
  if (err instanceof ApplicationError) {
    if(err.code && err.message) {
      return res.status(err.code).json({
        status: "err",
        message: err.message,
        code: err.code,
        data: {}
      });
    }
    // return res.status(err.code).json({
    //   status: "err",
    //   message: "Request could not be processed",
    //   code: err.code,
    //   data: {}
    // });
  }

  

  // Optionally log error internally, but do not expose details to client
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Handle unknown errors with generic message
  res.status(500).json({
    status: "err",
    message: "An unexpected error occurred",
    data: {}
  });
}

