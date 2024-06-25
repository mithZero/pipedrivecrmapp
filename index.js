const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cookieSession({
		name: "session",
		keys: ["key1"],
	})
);

const PORT = process.env.PORT || 3000;

const options = {
	dotfiles: "ignore",
	etag: false,
	extensions: ["htm", "html"],
	index: false,
	maxAge: "1d",
	redirect: false,
	setHeaders(res, path, stat) {
		res.set("x-timestamp", Date.now());
	},
};

app.use(express.static(path.join(__dirname, "modal/dist"), options));

const pipedrive = require("pipedrive");
const apiClient = new pipedrive.ApiClient();
// Configure authorization by settings api key
// PIPEDRIVE_API_KEY is an environment variable that holds real api key
apiClient.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;

// Configuration parameters and credentials
let oauth2 = apiClient.authentications.oauth2;
oauth2.clientId = process.env.CLIENT_ID; // OAuth 2 Client ID
oauth2.clientSecret = process.env.CLIENT_SECRET; // OAuth 2 Client Secret
oauth2.redirectUri = process.env.REDIRECT_URI; // OAuth 2 Redirection endpoint or Callback Uri

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/", async (req, res) => {
	if (
		req.session.accessToken !== null &&
		req.session.accessToken !== undefined &&
		req.session.refreshToken !== undefined
	) {
		// token is already set in the session
		// now make API calls as required
		// client will automatically refresh the token when it expires and call the token update callback
		const refreshPromise = apiClient.refreshToken();
		refreshPromise.then(
			() => {
				console.log("token has been refreshed");
			},
			(exception) => {
				throw new Error(exception);
				// error occurred, exception will be of type src/exceptions/OAuthProviderException
			}
		);
		const api = new pipedrive.DealsApi(apiClient);
		const deals = await api.getDeals();

		res.send(deals);
	} else {
		const authUrl = apiClient.buildAuthorizationUrl();

		res.redirect(authUrl);
	}
});

async function addNewCustomDealField(name, field_type) {
	try {
		const fieldsApi = new pipedrive.DealFieldsApi(apiClient);
		const dealFields = await fieldsApi.getDealFields();

		if (!dealFields.data.some((field) => field.name === name)) {
			await fieldsApi.addDealField({
				name,
				field_type,
			});
		}
	} catch (err) {
		const errorToLog = err.context?.body || err;

		throw new Error(errorToLog, "Adding failed");
	}
}

async function updateDealField(fieldName, value) {
	try {
		const DEAL_ID = 1; // An ID of Deal which will be updated
		const fieldsApi = new pipedrive.DealFieldsApi(apiClient);
		const dealsApi = new pipedrive.DealsApi(apiClient);

		// Get all Deal fields (keep in mind pagination)
		const dealFields = await fieldsApi.getDealFields();
		const nameField = dealFields.data.find((field) => field.name === fieldName);

		if (nameField) {
			await dealsApi.updateDeal(DEAL_ID, {
				[nameField.key]: value,
			});
		}
	} catch (err) {
		const errorToLog = err.context?.body || err;

		throw new Error(errorToLog, "Updating failed");
	}
}

app.post("/name", async (req, res) => {
	let success = true;
	const fields = [
		"addres",
		"area",
		"city",
		"email",
		"endTime",
		"firstName",
		"jobDescription",
		"jobSource",
		"jobType",
		"lastName",
		"phone",
		"startDate",
		"startTime",
		"state",
		"testSelect",
		"zipCode",
	];
	try {
		for (const field of fields) {
			addNewCustomDealField(field, "text");
		}
		console.log("hehehe")
		for (const [name, value] of Object.entries(req.body)) {
			updateDealField(name, value);
		}
	} catch (error) {
		success = false;
		console.log(error)
	}

	if (success) {
		res.status(200).json({message: "Success", success: true})	
	} else {
		res.status(400).json({message: "Error", succes: false})	
	}
});

app.get("/yoyo", (_, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/iframe", (_, res) => {
	res.sendFile(path.join(__dirname, "modal/dist/index.html"));
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
			throw new Error(exception);
			// error occurred, exception will be of type src/exceptions/OAuthProviderException
		}
	);
});
