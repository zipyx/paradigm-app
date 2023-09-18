## Websocket Client - Typescript

This is a websocket client using `deno` to run the application.

### Purpose

The purpose of this application is to test a websocket client from `typescript` given the `holochain` application has a `server` and `client`,
where the `client` is written in `typescript`. The client within a `holochain` app is not directly locked into the `dna` by `holochain` definition.
The `typescript` client will test sending data using the `websocket` protocol to the server and services hosted in AWS built by our central infrastructure.

### Requirements

Install the following onto your machine.

- pnpm
- javascript
- deno

### Installation

At the time of writing, all tests have been conducted within a linux machine, particularly `arch`. Although the `os` may be different, the commands
should be similar in nature if run on visual studio, WSL or some other editor with a command line functionality.

Run the following commands to get started. All commands are run from the terminal.

- install packages within this directory

```bash
pnpm i
```

- Use deno to run the `index.ts` file in your directory.

```bash
deno run index.ts
```

Or if using the script within the package.json, just run (not recommended - prone to break!):

```bash
pnpm test
```

### Note

You may need to implement changes as the websocket URL may be different for you when initializing the infrastructure containing the output
of your websocket URL and others etc.
