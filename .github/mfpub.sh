#!/usr/bin/env bash
#
# mfpub
# Use Jekyll to publich Marlin Documentation to the live site.
#

# build the site statically and proof it
bundle exec jekyll build --profile --trace --no-watch
bundle exec htmlproofer ./build --only-4xx --allow-hash-href --check-favicon --check-html --url-swap ".*marlinfw.org/:/"

# Sync the built site into a temporary folder
TMPFOLDER=$( mktemp -d )
rsync -av build/ ${TMPFOLDER}/

# Copy built-site into the gh-pages branch
git checkout gh-pages || { echo "Something went wrong!"; exit 1; }
rsync -av ${TMPFOLDER}/ ./

# Commit and push the new live site directly
git add --all
git commit --message "Built from ${COMMIT}"
git push

# remove the temporary folder
rm -rf ${TMPFOLDER}

# Go back to the branch we started from
git checkout master
