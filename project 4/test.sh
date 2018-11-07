#! /bin/bash

echo "Adding second block"
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json' \
     -d $'{"body":"Second block in the chain"}'
echo -e "\nSecond block has been added\n"


curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json' \
     -d $'{"body":"Third block in the chain"}'
echo -e "\nThird block has been added\n"


curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json' \
     -d $'{"body":"Forth block in the chain"}'
echo -e "\nForth block has been added\n"
