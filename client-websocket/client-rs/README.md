## Websocket Client - Rust

This is a websocket client using `cargo` to run the application.

### Purpose

The purpose of this application is to test a websocket client from `rust` given the `holochain` application has a `server` and `client`,
where the `server` is written in `rust`, compiled into `wasm`. The client is written in `js` / `ts` and is not directly locked into the
`dna` by `holochain` definition. The `rust` client will test sending data using the `websocket` protocol to the server and services hosted in AWS
built by our central infrastructure.

### Requirements

Install the following onto your machine.

- rust
- cargo

### Installation

At the time of writing, all tests have been conducted within a linux machine, particularly `arch`. Although the `os` may be different, the commands
should be similar in nature if run on visual studio, WSL or some other editor with a command line functionality.

Run the following commands to get started. All commands are run from the terminal.

- The packages will build once you run the following command in the `client-rs` directory.

```bash
cargo run
```

### Note

You may need to implement changes as the websocket URL may be different for you when initializing the infrastructure containing the output
of your websocket URL and others etc.
