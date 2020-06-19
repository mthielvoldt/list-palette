#!/bin/bash

rm -r build/
npm run build
rsync -rpgtP ../build/ mike@FARADAY:/home/mike/Webdev/list-palette/build