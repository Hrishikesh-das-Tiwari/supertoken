import ThirdPartyPasswordlessReact from "supertokens-auth-react/recipe/thirdpartypasswordless";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import Router from "next/router";

export let frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      ThirdPartyPasswordlessReact.init({
        signInUpFeature: {
          providers: [
            ThirdPartyPasswordlessReact.Github.init(),
            ThirdPartyPasswordlessReact.Google.init(),
            ThirdPartyPasswordlessReact.Apple.init(),
          ],
        },
        contactMethod: "EMAIL_OR_PHONE",
      }),
      SessionReact.init(),
    ],
    // this is so that the SDK uses the next router for navigation
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href);
          },
        },
      };
    },
  };
};
