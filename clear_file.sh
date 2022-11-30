#!/bin/bash

echo "Initializing script ..."

while true
do
    sed -i '/^/d' log.html
    sleep 900
    echo "Clearing file ..."
done