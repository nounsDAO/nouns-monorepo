# @nouns/bots

A bot that monitors for changes in Public Noun auction state and notifies everyone via Twitter and Discord.

## Environmental variables setup
Copy .env_example to .env and update vairables

## Docker setup
Copy docker-compose_yaml_example to docker-compose.yaml and update. Don't forget to set a secure password in both .env and docker-compose.yaml

Block public connections to Redis port 6379

## Install dependencies

```sh
yarn
```

## Start Redis

```sh
docker-compose up -d
```

## Start bots

```sh
yarn start

To run detached from console: (nohup yarn start&) 
```
