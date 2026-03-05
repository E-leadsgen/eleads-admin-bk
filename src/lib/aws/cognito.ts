import "dotenv/config";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient([
  {
    region: process.env.AWS_REGION,
  },
]);

class CognitoService {
  private client: CognitoIdentityProviderClient;
  private clientId: string;

  constructor(client: CognitoIdentityProviderClient) {
    this.client = client;

    if (!process.env.COGNITO_CLIENT_ID) {
      throw new Error("Missing required env var: COGNITO_CLIENT_ID");
    }

    this.clientId = process.env.COGNITO_CLIENT_ID;
  }

  async userSignUp(name: string, email: string, password: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "name",
          Value: name,
        },
      ],
    });

    const response = await this.client.send(command);

    if (!response.UserSub) {
      throw new Error("Failed to sign up user");
    }

    return response.UserSub;
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
    });

    await this.client.send(command);
  }

  async signIn(email: string, password: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await this.client.send(command);

    if (!response.AuthenticationResult) {
      throw new Error("Authentication failed");
    }

    return {
      accessToken: response.AuthenticationResult.AccessToken!,
      idToken: response.AuthenticationResult.IdToken!,
      refreshToken: response.AuthenticationResult.RefreshToken!,
    };
  }
}

export const cognitoService = new CognitoService(cognitoClient);
