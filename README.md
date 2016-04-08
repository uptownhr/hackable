# hackathon-starter-lite

[![Join the chat at https://gitter.im/uptownhr/hackathon-starter-lite](https://badges.gitter.im/uptownhr/hackathon-starter-lite.svg)](https://gitter.im/uptownhr/hackathon-starter-lite?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
lighter and easier version of hackathon starter

[![Build Status](https://travis-ci.org/uptownhr/hackathon-starter-lite.svg)](https://travis-ci.org/uptownhr/hackathon-starter-lite)
[![Dependency Status](https://david-dm.org/uptownhr/hackathon-starter-lite.svg)](https://david-dm.org/uptownhr/hackathon-starter-lite)
[![devDependency Status](https://david-dm.org/uptownhr/hackathon-starter-lite/dev-status.svg)](https://david-dm.org/uptownhr/hackathon-starter-lite)
[![Gitter chat](https://badges.gitter.im/uptownhr/hackathon-starter-lite.png)](https://gitter.im/uptownhr/hackathon-starter-lite)


## Requirements
- NodeJS
- MongoDB
- Redis
- Docker and Docker Compose *optional

## Getting Started
1. git clone git@github.com:uptownhr/hackathon-starter-lite
2. npm install
3. npm run dev

### Getting Started using Docker
If you have docker, all the project Requirements like Node, Mongo and Redis will automatically be installed and available. 

#### Docker Installation
1. [install docker](https://docs.docker.com/engine/installation/)
2. [install docker-compose](https://docs.docker.com/compose/install/)

#### Starting the project with Docker
1. git clone git@github.com:uptownhr/hackathon-starter-lite
2. cd hackathon-starter-lite
3. docker-compose up

## Docker Basics
If you are using docker here are some useful commands to know

### docker ps
This will show all the running processes started from docker-compose up
```
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                                      NAMES
f8a0b7b07f1c        node:5.8.0                 "npm run dev-docker"     16 hours ago        Up 16 hours         0.0.0.0:3000->3000/tcp                     hackathonstarterlite_app_1
517999e9ba29        mongo                      "/entrypoint.sh mongo"   16 hours ago        Up 16 hours         27017/tcp                                  hackathonstarterlite_mongo_1
26bd3d194207        redis                      "/entrypoint.sh redis"   16 hours ago        Up 16 hours         6379/tcp                                   hackathonstarterlite_redis_1
```
### docker exec
This will allow you to issue additional commands inside a running container.

Useful to get shell access.

`docker exec -it hackathonstarterlite_app_1 bash`

Get into mongo shell.

`docker exec -it hackathonstarterlite_mongo_1 bash`
