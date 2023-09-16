use serde_json::{Result, Value};
use websocket::{client::builder::ClientBuilder, Message};

fn main() -> Result<()> {

    let mut client = ClientBuilder::new("wss://dhtabh2uo3.execute-api.ap-southeast-2.amazonaws.com/dev")
        .unwrap()
        .connect_secure(None)
        .unwrap();

    // send_data message to server
    let data = r#"{
        "action": "sendmessage",
        "data": "Holochain App - Hello world!"
    }"#;

    let client_message: Value = serde_json::from_str(data)?;

    // send message to server
    // client.send_message(&Message::text("{'action':'sendmessage', 'data':'Holochain App - Hello world!'}")).unwrap();
    client.send_message(&Message::text(client_message.to_string())).unwrap();

    // return statement from client
    let response = client.recv_message().unwrap();

    println!("Received: {:?}", response);
    println!("Hello, world!");

    Ok(())
}
