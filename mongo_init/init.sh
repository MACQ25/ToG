#!/bin/bash
for f in /data/import/*.json; do
    mongoimport --db mtgdb --collection sets --file "$f"
done