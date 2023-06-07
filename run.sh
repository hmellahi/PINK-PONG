#!/bin/bash

current_ip=$(ipconfig getifaddr en0)
printf "Current IP: $current_ip"

# Replace '192.168.11.116' with your IP address
find . -type f -exec perl -pi -e 's/172\.16\.84\.159/'"$current_ip"'/g' {} +

docker-compose up -d --build