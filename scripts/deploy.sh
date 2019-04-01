#!/usr/bin/env sh
# abort on errors
set -e

# run build
gulp build-dist

# git subtree push --prefix dist origin gh-pages

# save submodule changes
cd dist
git add --all
git commit -m "update dist"
git push origin gh-pages
cd -
git add dist
git commit -m "updating master dist"
git push origin master
# make PR master <- gh-pages
