class Api {
	constructor() {
		this.pipedrive = require("pipedrive");
		this.client = new this.pipedrive.ApiClient();
		// Configure authorization by settings api key
		// PIPEDRIVE_API_KEY is an environment variable that holds real api key
		this.client.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;

		// Configuration parameters and credentials
		let oauth2 = this.client.authentications.oauth2;
		oauth2.clientId = process.env.CLIENT_ID; // OAuth 2 Client ID
		oauth2.clientSecret = process.env.CLIENT_SECRET; // OAuth 2 Client Secret
		oauth2.redirectUri = process.env.REDIRECT_URI; // OAuth 2 Redirection endpoint or Callback Uri
	}

	async addNewCustomDealField(name, field_type) {
		try {
			const fieldsApi = new this.pipedrive.DealFieldsApi(this.client);
			const dealFields = await fieldsApi.getDealFields();

			if (!dealFields.data.some((field) => field.name === name)) {
				await fieldsApi.addDealField({
					name,
					field_type,
				});
			}
		} catch (err) {
			const errorToLog = err.context?.body || err;

			console.log("Adding failed", errorToLog);
			throw new Error("Adding failed");
		}
	}

	async updateDealField(fieldName, value) {
		try {
			const DEAL_ID = 1; // An ID of Deal which will be updated
			const fieldsApi = new this.pipedrive.DealFieldsApi(this.client);
			const dealsApi = new this.pipedrive.DealsApi(this.client);

			// Get all Deal fields (keep in mind pagination)
			const dealFields = await fieldsApi.getDealFields();
			const nameField = dealFields.data.find(
				(field) => field.name === fieldName
			);

			if (nameField) {
				await dealsApi.updateDeal(DEAL_ID, {
					[nameField.key]: value,
				});
			}
		} catch (err) {
			const errorToLog = err.context?.body || err;

			console.log("Updating failed", errorToLog);
			throw new Error("Updating failed");
		}
	}
}

module.exports = new Api();
