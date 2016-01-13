#!/bin/bash

if [ ! -d ./src ]
then
    pkdir -p ./src
    touch ./src/jest.lastrun
    ./node_modules/.bin/babel app --out-dir src --stage 1 --compact false > /dev/null
else
    for i in `find app -type f -newer ./src/jest.lastrun`
    do
        ./node_modules/.bin/babel $i --out-file `echo $i | sed 's#^app#src#'`
    done
    touch ./src/jest.lastrun
fi

COMPILED=`echo $1 | sed 's/app\///g'`
echo "node --debug node_modules/jest-cli/bin/jest.js --runInBand src/$COMPILED"
node --debug node_modules/jest-cli/bin/jest.js --runInBand src/$COMPILED
