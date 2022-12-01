#!/bin/bash

echo "Initializing script ..."

while true
do
    sed -i '/^/d' database/log.txt
    sleep 900
    echo "Clearing file ..."
done