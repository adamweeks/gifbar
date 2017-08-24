#!/bin/bash
# copy env var file
cp env.json src/

# build
mkdir build

rm -rf build/*
cp -r src/* build/

mkdir build/node_modules
# TODO: Get these packages from app/package.json
cp -a node_modules/applescript build/node_modules/
cp -a node_modules/auto-launch-patched build/node_modules/
cp -a node_modules/electron-positioner build/node_modules/
cp -a node_modules/electron-settings build/node_modules/
cp -a node_modules/extend build/node_modules/
cp -a node_modules/growly build/node_modules/
cp -a node_modules/isexe build/node_modules/
cp -a node_modules/mkdirp build/node_modules/
cp -a node_modules/node-notifier build/node_modules/
cp -a node_modules/path-is-absolute build/node_modules/
cp -a node_modules/semver build/node_modules/
cp -a node_modules/shellwords build/node_modules/
cp -a node_modules/untildify build/node_modules/
cp -a node_modules/which build/node_modules/
cp -a node_modules/winreg build/node_modules/

npm run build-webpack
