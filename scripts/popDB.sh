#!/bin/bash
mongoimport --db test --collection users --type json --file seed.json --jsonArray