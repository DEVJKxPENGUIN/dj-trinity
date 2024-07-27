#!/bin/bash

RUN_MODULE=""
MODE="local"
RUN_TYPE="client"

# parse arguments
while (("$#")); do
  if [ "-app" = $1 ]; then
    RUN_MODULE="app"
  fi
  if [ "-appBuild" = $1 ]; then
    RUN_MODULE="appBuild"
  fi
  if [ "-web" = $1 ]; then
    RUN_MODULE="web"
  fi
  if [ "-local" = $1 ]; then
    MODE=local
  fi
  if [ "-dev" = $1 ]; then
    MODE=dev
  fi
  shift
done

if [ ${RUN_TYPE} = "client" ]; then

  FULL_ARGS=""
  if [ "$RUN_MODULE" = "app" ]; then
    # FULL_ARGS="npm run --prefix ./client ${MODE}:electron"
    FULL_ARGS="npm run --prefix ./client electron:serve"
  fi

  if [ "$RUN_MODULE" = "appBuild" ]; then
    # FULL_ARGS="npm run --prefix ./client ${MODE}:electron"
    FULL_ARGS="npm run --prefix ./client electron:build"
  fi

  if [ "$RUN_MODULE" = "web" ]; then
    # FULL_ARGS="npm run --prefix ./client ${MODE}:vite"
    FULL_ARGS="npm run --prefix ./client serve"
  fi

  if [ "$FULL_ARGS" = "" ]; then
    echo 'you should choose module option (-web, -app)'
    exit 1
  fi

  echo RUN_MODULE : ${RUN_MODULE}
  echo MODE : ${MODE}
  echo FULL_ARGS : "${FULL_ARGS}"
  ${FULL_ARGS}

fi
