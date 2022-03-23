#!/bin/bash

expo build:web
echo "levxdao.org" > web-build/CNAME
gh-pages -d web-build --remote=gh-pages
