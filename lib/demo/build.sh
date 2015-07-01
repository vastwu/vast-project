#!/bin/sh

node ./build/build.js

exit
rm -rf output
node ./build/r.js -o ./build/buildConfig.js
node ./build/buildHook.js


rm -rf output/tmp
