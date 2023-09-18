import {
  ArrayQueue,
  ConstantBackoff,
  Websocket,
  WebsocketBuilder,
  WebsocketEvent,
} from "websocket-ts";

// build websocket connection
const websocketConnection = new WebsocketBuilder(
  "wss://dhtabh2uo3.execute-api.ap-southeast-2.amazonaws.com/dev",
)
  .withBuffer(new ArrayQueue()) // buffer messages when disconnected
  .withBackoff(new ConstantBackoff(1000)) // retry every 1s
  .build();

// prepare data to send
const data = {
  action: "sendmessage",
  data: "(Holochain Application) [Client-ts]: sending message from client",
};

// send_data to server
websocketConnection.send(JSON.stringify(data));

// echo all messages received from the websocket server
const echoOnMessage = (i: Websocket, ev: MessageEvent) => {
  console.log(`received message: ${ev.data}`);
  i.send(`echo: ${ev.data}`);
};

// Add event listener for connection open
websocketConnection.addEventListener(WebsocketEvent.open, () =>
  console.log("connection opened!"),
);

// Add event listener for connection errors
websocketConnection.addEventListener(WebsocketEvent.error, () =>
  console.log("connection error!"),
);

// Add event listener for connection reconnect
websocketConnection.addEventListener(WebsocketEvent.reconnect, () =>
  console.log("connection successfully reconnected!"),
);

// Add event listener for connection close
websocketConnection.addEventListener(WebsocketEvent.close, () =>
  console.log("connection closed!"),
);

// Add event listener for messages received
websocketConnection.addEventListener(WebsocketEvent.message, echoOnMessage);
