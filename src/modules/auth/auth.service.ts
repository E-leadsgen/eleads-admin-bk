import { cognitoService } from "../../lib/aws/cognito";
import AuthRepository from "./auth.repository";
import {
  ConfirmSignUpInput,
  SignInInput,
  SignUpInput,
} from "./auth.validation";

class AuthService {
  async signUp(input: SignUpInput) {
    const { name, email, password } = input;

    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new AuthError("Email is already registered", "EMAIL_EXISTS");
    }

    let cognitoSub: string;
    try {
      cognitoSub = await cognitoService.userSignUp(name, email, password);
    } catch (error: unknown) {
      console.log({ error });
      const message =
        error instanceof Error ? error.message : "Cognito sign-up failed";
      throw new AuthError(message, "COGNITO_ERROR");
    }

    const user = await AuthRepository.create({
      id: cognitoSub,
      name,
      email,
      role: "client",
    });

    return user;
  }

  async confirmSignUp(input: ConfirmSignUpInput) {
    const { email, confirmationCode } = input;

    try {
      await cognitoService.confirmSignUp(email, confirmationCode);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Confirmation failed";
      throw new AuthError(message, "COGNITO_ERROR");
    }
  }

  async signIn(input: SignInInput) {
    const { email, password } = input;

    try {
      const tokens = await cognitoService.signIn(email, password);
      return tokens;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      throw new AuthError(message, "COGNITO_ERROR");
    }
  }
}

export class AuthError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export default new AuthService();
