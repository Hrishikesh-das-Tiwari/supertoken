import ThirdPartyPasswordlessNode from "supertokens-node/recipe/thirdpartypasswordless";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import randomWords from "random-words";
import { appInfo } from "./appInfo";
import { AuthConfig } from "../interfaces";
import workspace from "../models/workspace";

export let backendConfig = (): AuthConfig => {
  return {
    framework: "express",
    supertokens: {
      connectionURI:
        "https://dev-1c0a8771e8ff11edb9b8b90a35a84dea-eu-west-1.aws.supertokens.io:3570",
      apiKey: "JSYN4bLubgvKvv8CHuO9InTaWPCJH=",
    },
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      ThirdPartyPasswordlessNode.init({
        providers: [
          // We have provided you with development keys which you can use for testing.
          // IMPORTANT: Please replace them with your own OAuth keys for production use.
          ThirdPartyPasswordlessNode.Google({
            clientId:
              "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
            clientSecret: "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",
          }),
          ThirdPartyPasswordlessNode.Github({
            clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
            clientId: "467101b197249757c71f",
          }),
          ThirdPartyPasswordlessNode.Apple({
            clientId: "4398792-io.supertokens.example.service",
            clientSecret: {
              keyId: "7M48Y4RYDL",
              privateKey:
                "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
              teamId: "YWQCXGJRJL",
            },
          }),
        ],
        contactMethod: "EMAIL_OR_PHONE",
        flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              // override the thirdparty sign in / up API
              thirdPartySignInUpPOST: async function (input) {
                if (
                  originalImplementation.thirdPartySignInUpPOST === undefined
                ) {
                  throw Error("Should never come here");
                }

                // TODO: Some pre sign in / up logic

                let response =
                  await originalImplementation.thirdPartySignInUpPOST(input);

                if (response.status === "OK") {
                  if (response.createdNewUser) {
                    // TODO: User is New User so Create a workspace for him
                    const word = randomWords(1)[0];
                    await workspace.create({
                      userId: response.user.id,
                      name: word,
                    });
                  }
                }

                return response;
              },

              consumeCodePOST: async (input) => {
                if (originalImplementation.consumeCodePOST === undefined) {
                  throw Error("Should never come here");
                }

                // First we call the original implementation of consumeCodePOST.
                const response = await originalImplementation.consumeCodePOST(
                  input
                );

                // Post sign up response, we check if it was successful
                if (response.status === "OK") {
                  let userId, phoneNumber, email;
                  if ("phoneNumber" in response.user) {
                    const { id, phoneNumber: pNo } = response.user;
                    userId = id;
                    phoneNumber = pNo;
                  } else {
                    const { id, email: em } = response.user;
                    userId = id;
                    email = em;
                  }

                  if (response.createdNewUser) {
                    // TODO: User is New User so Create a workspace for him
                    const word = randomWords(1)[0];
                    await workspace.create({
                      userId: response.user.id,
                      name: word,
                    });
                  }
                }
                return response;
              },
            };
          },
        },
      }),
      SessionNode.init(),
      Dashboard.init(),
    ],
    isInServerlessEnv: true,
  };
};
