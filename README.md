# Paradigm App

An application that aims to merge decentralization with centralization paradigms using methods well known in both Web3 and Web2
frameworks.

## Architecture

The project is made up of three different parts.

- central-infrastructure

This directory is responsible for building out the infrastructure to possibly connect the integrated services that may sit on a centralised network with a holochain app

- idsov-\*

A holochain application that performs peer to peer functionality running `CRUD` actions with the possible option of sending data through a websocket-client within the holochain
application to centralised network infrastructure within the cloud.

- client-websocket

A simple websocket client to make calls to a websocket server hosted on the central-infrastructure. This is to simulate a centralised network that may be used to connect to the holochain application.
This in principle will be added within the holochain application.
