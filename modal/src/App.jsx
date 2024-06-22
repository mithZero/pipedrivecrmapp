import {} from "react";
import "./App.css";
import AppExtensionsSDK, {
	Command,
	Modal,
} from "@pipedrive/app-extensions-sdk";


function App() {
  (async function() {
    console.log('woyay')
    const sdk = await new AppExtensionsSDK({
      identifier: "21c812a2-5e19-4b58-8fbf-25e86818e16a"
    }).initialize({ size: { height: 500 , width: 400} }).then((data => console.log(data)), (data) => console.log(data))

    console.log(sdk)

    sdk.listen(Event.VISIBILITY, ({ error, data }) => {
      console.log(error, data)
    });

    try {
      const { status } = await sdk.execute(Command.OPEN_MODAL, {
        type: Modal.CUSTOM_MODAL,
        action_id: "21c812a2-5e19-4b58-8fbf-25e86818e16a",
        data: {
          item: "xyz",
        }
      });
      console.log(status);
    } catch (err) {
      console.log(err)
    }
  
  })();
  
  return <><h1>Hello, world!</h1></>;
}

export default App;
