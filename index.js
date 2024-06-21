const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require("dotenv").config();

app.use(cookieParser());
app.use(
	cookieSession({
		name: "session",
		keys: ["key1"],
	})
);
const PORT = 1800;

const pipedrive = require("pipedrive");

const apiClient = new pipedrive.ApiClient();

// Configuration parameters and credentials
let oauth2 = apiClient.authentications.oauth2;
oauth2.clientId = process.env.CLIENT_ID; // OAuth 2 Client ID
oauth2.clientSecret = process.env.CLIENT_SECRET; // OAuth 2 Client Secret
oauth2.redirectUri = process.env.REDIRECT_URI; // OAuth 2 Redirection endpoint or Callback Uri

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/", async (req, res) => {
	res.send("Hello, world!");
	if (
		req.session.accessToken !== null &&
		req.session.accessToken !== undefined
	) {
		// token is already set in the session
		// now make API calls as required
		// client will automatically refresh the token when it expires and call the token update callback
		const api = new pipedrive.DealsApi(apiClient);
		const deals = await api.getDeals();

		res.send(deals);
	} else {
		const authUrl = apiClient.buildAuthorizationUrl();

		res.redirect(authUrl);
	}
});

app.get("/callback", (req, res) => {
	const authCode = req.query.code;
	const promise = apiClient.authorize(authCode);

	promise.then(
		() => {
			req.session.accessToken = apiClient.authentications.oauth2.accessToken;
			res.redirect("/");
		},
		(exception) => {
			// error occurred, exception will be of type src/exceptions/OAuthProviderException
		}
	);
});
