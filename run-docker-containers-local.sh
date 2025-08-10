#!/bin/bash

#command to run docker compose
docker-compose down --volumes --remove-orphans
docker-compose -f docker-compose.yml up --build --remove-orphans -d
