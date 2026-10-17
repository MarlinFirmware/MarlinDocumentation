#!/bin/sh
# Point this clone at the tracked git hooks in .githooks (pre-commit runs _tools/check_site.py).
cd "$(dirname "$0")/.." || exit 1
git config core.hooksPath .githooks && echo "hooks enabled: $(git config core.hooksPath)"
