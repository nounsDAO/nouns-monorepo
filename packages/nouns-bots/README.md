# @nouns/bots

A bot that monitors for changes in Public Noun auction state and notifies everyone via Twitter and Discord.

## Environmental variables setup
Copy .env_example to .env and update vairables.

## Docker setup
Copy docker-compose_yaml_example to docker-compose.yaml and update. Don't forget to set a secure password that matches in both .env and docker-compose.yaml

Block public connections to the Redis server port 6379 unless you need a publicly accessible Redis instance.

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
```
To run detached from console:

```sh
(nohup yarn start&) 
```
