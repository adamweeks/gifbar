#!/bin/bash

mkdir build

rm -rf build/*
cp -r src/* build/

mkdir build/node_modules
cp -a node_modules/applescript build/node_modules/
cp -a node_modules/auto-launch-patched build/node_modules/
cp -a node_modules/electron-positioner build/node_modules/
cp -a node_modules/electron-settings build/node_modules/
cp -a node_modules/extend build/node_modules/
cp -a node_modules/mkdirp build/node_modules/
cp -a node_modules/path-is-absolute build/node_modules/
cp -a node_modules/untildify build/node_modules/
cp -a node_modules/winreg build/node_modules/

npm run build-webpack
