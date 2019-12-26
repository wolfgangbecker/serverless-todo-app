// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = process.env.REACT_APP_API_ID
const region = process.env.REACT_APP_REGION
const stage = process.env.REACT_APP_STAGE

const domain = process.env.REACT_APP_DOMAIN
const clientId = process.env.REACT_APP_CLIENT_ID
const callbackUrl = process.env.REACT_APP_CALLBACK_URL

export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain,
  clientId,
  callbackUrl
}
