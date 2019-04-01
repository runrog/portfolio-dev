#!/usr/bin/env sh
# abort on errors
set -e

# run build
gulp build-dist

# deploy to github pages
git subtree push --prefix dist origin gh-pages
