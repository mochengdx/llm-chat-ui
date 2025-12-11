import { StreamAdapter, StreamCallbacks, StreamRequest } from "@llm/core";

export default class MyCustomAdapter extends StreamAdapter {
  connect(request: StreamRequest, callbacks: StreamCallbacks) {
    // Your custom logic here (e.g., using a different library, custom protocol, etc.)
    console.log("Connecting via MyCustomAdapter");
    callbacks.onStart?.();
    // ...
  }

  disconnect() {
    console.log("Disconnecting MyCustomAdapter");
  }
}
