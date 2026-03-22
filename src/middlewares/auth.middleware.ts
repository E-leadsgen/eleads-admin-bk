import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { httpResponse } from "../lib/http-response";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    email: string;
    groups: string[];
  };
}

export function authenticate() {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return httpResponse.unauthorized(res, "Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return httpResponse.unauthorized(res, "Missing or invalid token");
    }

    try {
      const payload = await verifier.verify(token);

      req.user = {
        sub: payload.sub,
        email: payload.email as string,
        groups: (payload["cognito:groups"] as string[]) || [],
      };

      next();
    } catch {
      return httpResponse.unauthorized(res, "Invalid or expired token");
    }
  };
}

export function requireGroup(group: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.groups.includes(group)) {
      return httpResponse.forbidden(
        res,
        "You do not have permission to access this resource",
      );
    }

    next();
  };
}
