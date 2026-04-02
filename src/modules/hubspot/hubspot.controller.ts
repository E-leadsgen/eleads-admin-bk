import { Request, Response } from "express";
import hubspotService from "./hubspot.service";
import { httpResponse } from "../../lib/http-response";
import {
  validateCompanyByEmail,
  validateCompanyContactsQuery,
} from "./hubspot.validation";

class HubspotController {
  async getCompanyByEmail(req: Request, res: Response) {
    try {
      const { errors, data } = validateCompanyByEmail(req.query);
      if (errors) {
        return httpResponse.badRequest(res, "Validation failed", errors);
      }

      const company = await hubspotService.findCompanyByEmail(data!.email);
      if (!company) {
        return httpResponse.notFound(
          res,
          "Company not found for that email domain",
        );
      }

      return httpResponse.ok(res, company, "Company retrieved successfully");
    } catch (error) {
      console.log("Server error in getCompanyByEmail", error);
      return httpResponse.internalError(
        res,
        "Server error in getCompanyByEmail",
      );
    }
  }

  async getCompanyContacts(req: Request, res: Response) {
    try {
      const { errors: emailErrors, data: emailData } = validateCompanyByEmail(
        req.query,
      );
      if (emailErrors) {
        return httpResponse.badRequest(res, "Validation failed", emailErrors);
      }

      const { errors: queryErrors, data: query } = validateCompanyContactsQuery(
        req.query,
      );
      if (queryErrors) {
        return httpResponse.badRequest(res, "Validation failed", queryErrors);
      }

      const company = await hubspotService.findCompanyByEmail(emailData!.email);
      console.log({ company });
      if (!company) {
        return httpResponse.notFound(
          res,
          "Company not found for that email domain",
        );
      }

      const contacts = await hubspotService.findCompanyContacts(
        company.id,
        query!,
      );

      return httpResponse.ok(
        res,
        { company, contacts },
        "Company contacts retrieved successfully",
      );
    } catch (error) {
      console.log("Server error in getCompanyContacts", error);
      return httpResponse.internalError(
        res,
        "Server error in getCompanyContacts",
      );
    }
  }
}

export default new HubspotController();
