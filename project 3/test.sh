#! /bin/bash

curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json' \
     -d $'{
  "hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3",
  "height":0,
  "body":"First block in the chain - Genesis block",
  "time":"1530311457",
  "previousBlockHash":""
}'
