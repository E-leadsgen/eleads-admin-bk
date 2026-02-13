import { Request, Response } from "express";
import userService from "./user.service";
import { httpResponse } from "../../lib/http-response";

class UserController {
  async getUser(req: Request, res: Response) {
    try {
      const user = await userService.findByEmail(req.params.email as string);
      if (!user) {
        return httpResponse.notFound(res, "User not found");
      }
      return httpResponse.ok(res, user, "User retrieved successfully");
    } catch (error) {
      return httpResponse.internalError(res, "Server error");
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const existingUser = await userService.findByEmail(req.body.email);
      if (existingUser) {
        return httpResponse.badRequest(res, "Email already exists");
      }

      const user = await userService.create(req.body);
      return httpResponse.created(res, user, "User created successfully");
    } catch (error) {
      return httpResponse.internalError(res, "Server error");
    }
  }

  async updateUser(req: Request, res: Response) {}
}

export default new UserController();
