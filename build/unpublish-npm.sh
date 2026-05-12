#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/variable-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/variable-editor-protocol@${1}" --registry $REGISTRY
