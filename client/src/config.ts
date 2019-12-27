// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = "82suylz0sj"
const region = "eu-central-1"
const stage = "dev"

const domain = "dev-9ncdqdat.eu.auth0.com"
const clientId = "9349BqehLj3ZrZtISGqpchVGUJkC3BwE"
const callbackUrl = "http://localhost:3000/callback"

export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain,
  clientId,
  callbackUrl
}
