#!/bin/bash

echo What should the version be?
read VERSION

docker build -t adampap/next-journey:$VERSION .
docker push adampap/next-journey:$VERSION
ssh root@167.99.243.231 "docker pull adampap/next-journey:$VERSION && docker tag adampap/next-journey:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"