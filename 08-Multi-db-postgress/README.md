## ---- POSTGRES

docker run \
 --name postgres \
 -e POSTGRES_USER=marcilioreis \
 -e POSTGRES_PASSWORD=62724546 \
 -e POSTGRES_DB=heroes \
 -p 5432:5432 \
 -d \
 postgres

docker ps

winpty docker exec -it postgres //bin//bash

docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer

## ---- MONGODB

docker run \
 --name mongodb \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=62724546 \
 -d \
 mongo:4

docker ps

docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongodb:mongodb \
 -d \
 mongoclient/mongoclient

winpty docker exec -it mongodb \
 mongo --host localhost -u admin -p 62724546 --authenticationDatabase admin \
 --eval "db.getSiblingDB('heroes').createUser({user: 'marcilioreis', pwd: '62724546', roles: [{role: 'readWrite', db: 'heroes'}]})"
