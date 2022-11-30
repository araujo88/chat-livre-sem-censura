#!/bin/bash
while true
do
    echo "Clearing file ..."
    sed -i '/^/d' log.html
    sleep 900
done