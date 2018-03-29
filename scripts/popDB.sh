#!/bin/bash
mongoimport --db test --collection users --type json --file seed.json --jsonArray
mongoimport --db test --collection events --type json --file testEventSeed.json --jsonArray