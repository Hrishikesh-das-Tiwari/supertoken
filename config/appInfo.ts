const port = process.env.APP_PORT || 3000;

const apiBasePath = "/api/auth/";

// export const websiteDomain = "http://localhost:3000";
export const websiteDomain = "https://supertoken-silk.vercel.app/";

export const appInfo = {
  appName: "SuperTokens Demo App",
  websiteDomain,
  apiDomain: websiteDomain,
  apiBasePath,
};
