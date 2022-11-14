# CCP555 Project - Fragments Microservice

The REST API server of the Microservice Project called "fragments" will respond to different HTTP requests/calls to manage the fragment data

## Implemented HTTP Requests

- GET
  - GET list of fragments ID (/v1/fragments)
  - GET list of fragments metadata (/v1/fragments/?expand=1)
- GET by ID
  - GET fragment data by fragment ID (/v1/fragments/:id)
  - GET fragment metadata by fragment ID (/v1/fragments/:id/info)
- POST (/v1/fragments)
- PUT (under development...)
- DELETE (under development...)

## How to Set Up the Project

1. Create an empty folder
2. Add the folder to workplace area in VS Code and open terminal OR navigate to the created folder using terminal
3. Enter to the terminal:
   `git clone https://github.com/ZhenyaChan/fragments.git`
4. Enter for installing all project dependencies: `npm i` or `npm ci` (clean install)
5. - To run the server normally: `npm start`
   - To run the server via nodemon(restarting server after every update): `npm run dev`
   - To run the server via nodemon with node inspector: `npm run debug`

```sh
NOTE: the REST API server will not run unless you add .env file with authentication credentials, port, and API URL numbers.
```

## How to find possible errors in code (run ESLint)

```sh
npm run lint
```

## How to run the unit testing (run JEST)

- To run the unit testing normally: `npm run test`
- To run the unit testing after every change: `npm run test:watch`
- To run the unit testing and get the testing coverage report: `npm run coverage`
