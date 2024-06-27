const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require("dotenv").config();
const api = require("./api.js");

const { camelCaseToWords } = require("./helpers.js");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cookieSession({
		name: "session",
		keys: ["key1"],
	})
);

const options = {
	dotfiles: "ignore",
	etag: false,
	extensions: ["htm", "html"],
	index: false,
	maxAge: "1d",
	redirect: false,
	setHeaders(res, _path, _stat) {
		res.set("x-timestamp", Date.now());
	},
};
app.use(express.static(path.join(__dirname, "modal/dist"), options));

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

app.get("/", async (req, res) => {
	if (
		req.session.accessToken !== null &&
		req.session.accessToken !== undefined &&
		req.session.refreshToken !== undefined
	) {
		const refreshPromise = api.client.refreshToken();
		refreshPromise.then(
			() => {
				console.log("token has been refreshed");
			},
			(exception) => {
				throw new Error(exception);
			}
		);
		const dealsApi = api.pipedrive.DealsApi(apiClient);
		const deals = await dealsApi.getDeals();

		res.send(deals);
	} else {
		const authUrl = api.client.buildAuthorizationUrl();

		res.redirect(authUrl);
	}
});

app.post("/save", async (req, res) => {
	const fields = [
		"address",
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
			await api.addNewCustomDealField(camelCaseToWords(field), "text");
		}

		for (const [name, value] of Object.entries(req.body)) {
			await api.updateDealField(camelCaseToWords(name), value);
		}

		res.status(200).json({ success: true });
	} catch (error) {
		success = false;
		console.log("catch", error);
		res.status(400).json({ succes: false });
	}
});

app.get("/iframe", (req, res) => {
	res.append(JSON.stringify(req));
	res.sendFile(path.join(__dirname, "modal/dist/index.html"));
});

app.get("/callback", (req, res) => {
	const authCode = req.query.code;
	const promise = api.client.authorize(authCode);

	promise.then(
		() => {
			req.session.accessToken = api.client.authentications.oauth2.accessToken;
			res.redirect("/");
		},
		(exception) => {
			throw new Error(exception);
		}
	);
});
