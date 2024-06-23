import { useEffect } from "react";
import "./App.css";
import AppExtensionsSDK, {
	Command,
	Modal,
} from "@pipedrive/app-extensions-sdk";

function App() {
	useEffect(() => {
		(async () => {
			const sdk = new AppExtensionsSDK();

			await sdk.initialize();

			// try {
			// 	await sdk.execute(Command.OPEN_MODAL, {
			// 		type: Modal.CUSTOM_MODAL,
			// 		action_id: "21c812a2-5e19-4b58-8fbf-25e86818e16a",
			// 	});
			// } catch (err) {
			// 	console.log(err);
			// }
		})();
	}, []);

	return (
		<>
			<h1>Hello, world!</h1>
		</>
	);
}

export default App;
