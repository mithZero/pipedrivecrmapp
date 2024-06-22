import {} from "react";
import "./App.css";
import AppExtensionsSDK, {
	Command,
	Modal,
} from "@pipedrive/app-extensions-sdk";

async function App() {
  const sdk = new AppExtensionsSDK({
    identifier: "21c812a2-5e19-4b58-8fbf-25e86818e16a",
  });
  
  await sdk.initialize({ size: { height: 500 } })
  
  const { status } = await sdk.execute(Command.OPEN_MODAL, {
    type: Modal.CUSTOM_MODAL,
    action_id: "21c812a2-5e19-4b58-8fbf-25e86818e16a",
    data: {
      item: "xyz",
    }
  });
  console.log(status);
  
  return <><h1>Hello, world!</h1></>;
}

export default App;
