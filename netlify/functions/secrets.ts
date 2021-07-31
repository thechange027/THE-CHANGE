import { NetlifySecrets, withSecrets } from "@sgrove/netlify-functions";

// This function replaces all but the last four digits of a string with zeroes
const sanitizeToken = (str: string, length = 16): string => {
  const len = str.length;
  const displayed = len > 4 ? str.substr(len - 4, len) : str;

  const padLength = length - displayed.length;
  return displayed.padStart(padLength, "*");
};

export const handler = withSecrets(async (event, { secrets }) => {
  const { gitHub, salesforce, spotify } = secrets;

  // Sanitize the secrets before showing them to the user
  const sanitizedSecrets: NetlifySecrets = {
    gitHub: {
      ...gitHub,
      bearerToken: gitHub?.bearerToken
        ? sanitizeToken(gitHub.bearerToken)
        : null,
    },
    salesforce: {
      ...salesforce,
      bearerToken: salesforce?.bearerToken
        ? sanitizeToken(salesforce.bearerToken)
        : null,
    },
    spotify: {
      ...spotify,
      bearerToken: spotify?.bearerToken
        ? sanitizeToken(spotify.bearerToken)
        : null,
    },
  };

  return {
    statusCode: 200,
    body: JSON.stringify(sanitizedSecrets),
    headers: {
      "Content-Type": "application/json",
    },
  };
});
