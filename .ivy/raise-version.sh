#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

mvn --batch-mode -f playwright/tests/screenshots/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/variables-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}

pnpm install
pnpm run raise:version ${1/SNAPSHOT/next}
pnpm install --no-frozen-lockfile
