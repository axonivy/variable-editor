#!/bin/bash
set -e

mvn --batch-mode -f integrations/standalone/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/tests/screenshots/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/variables-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}

pnpm install
pnpm raise:version ${1/SNAPSHOT/next}
pnpm install
