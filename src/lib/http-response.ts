import { Response } from "express";

export type SuccessResponse<T = unknown> = {
  success: true;
  message?: string;
  data?: T;
};

export type ErrorDetail = string | Record<string, unknown>;

export type ErrorResponse = {
  success: false;
  message: string;
  errors?: ErrorDetail | ErrorDetail[];
};

type AnyResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
) {
  const payload: SuccessResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    ...(typeof data !== "undefined" ? { data } : {}),
  };

  return res.status(statusCode).json(payload);
}

function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: ErrorDetail | ErrorDetail[],
) {
  const payload: ErrorResponse = {
    success: false,
    message,
    ...(typeof errors !== "undefined" ? { errors } : {}),
  };

  return res.status(statusCode).json(payload);
}

export const httpResponse = {
  ok<T = unknown>(res: Response, data?: T, message = "OK") {
    return sendSuccess<T>(res, 200, data, message);
  },

  created<T = unknown>(res: Response, data?: T, message = "Created") {
    return sendSuccess<T>(res, 201, data, message);
  },

  noContent(res: Response) {
    return res.status(204).send();
  },

  badRequest(
    res: Response,
    message = "Bad Request",
    errors?: ErrorDetail | ErrorDetail[],
  ) {
    return sendError(res, 400, message, errors);
  },

  unauthorized(
    res: Response,
    message = "Unauthorized",
    errors?: ErrorDetail | ErrorDetail[],
  ) {
    return sendError(res, 401, message, errors);
  },

  forbidden(
    res: Response,
    message = "Forbidden",
    errors?: ErrorDetail | ErrorDetail[],
  ) {
    return sendError(res, 403, message, errors);
  },

  notFound(
    res: Response,
    message = "Not Found",
    errors?: ErrorDetail | ErrorDetail[],
  ) {
    return sendError(res, 404, message, errors);
  },

  conflict(
    res: Response,
    message = "Conflict",
    errors?: ErrorDetail | ErrorDetail[],
  ) {
    return sendError(res, 409, message, errors);
  },

  internalError(
    res: Response,
    message = "Internal Server Error",
    errors?: ErrorDetail | ErrorDetail[],
  ) {
    return sendError(res, 500, message, errors);
  },
};

export type ApiResponse<T = unknown> = AnyResponse<T>;
