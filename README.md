# CCP555 Project - Fragments Microservice

REST API server of the Microservice Project called "fragments"

## How to Set Up the Project

1. Create an empty folder
2. Add the folder to workplace area in VS Code and open terminal OR navigate to the created folder using terminal
3. Enter to the terminal:
   git clone https://github.com/ZhenyaChan/fragments.git
4. Enter for installing all project dependencies: `npm i` or `npm ci` (clean install)
5. - To run the server normally: `npm start`
   - To run the server via nodemon(restarting server after every update): `npm run dev`
   - To run the server via nodemon with node inspector: `npm run debug`

## How to find possible errors in code (run ESLint)

```sh
npm run lint
```

## How to run the unit testing (run JEST)

- To run the unit testing normally:

```sh
npm run test
```

- To run the unit testing after every change:

```sh
npm run test:watch
```

- To run the unit testing and get the testing coverage report

```sh
npm run coverage
```
