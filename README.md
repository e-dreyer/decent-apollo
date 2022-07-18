# decent-apollo

Simple social media clone of reddit and medium for learning purposes. This repository containes most of the backend code used in the project.
Although this repository can be used on its own, it is intended to be used in combination with the other decent-app repositories listed in [decent-app](https://github.com/e-dreyer/decent-app.git)

This repository contains the configuration for the apollo server that hosts the prisma and nexus instance

## References

At the start of the project the this [excelent guide](https://www.tomray.dev/setup-and-deploy-graphql-server#creating-the-project=)
was used for the initial setup.

## Cloning the repository

```bash
git clone https://github.com/e-dreyer/decent-apollo.git
```

## Running without docker

```bash
cd decent-apollo/
yarn dev
```

## Running with docker

Be sure to include the period at the end of the command

```bash
docker build -t decent-apollo .
docker start decent-apollo
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## Linting and Formating

This project includes a basic linter and formatter as it was developed in NeoVim

```bash
yarn format
yarn lint:fix
```
