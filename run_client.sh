#!/bin/bash

RUN_MODULE=""
MODE="local"
RUN_TYPE="client"

# parse arguments
while (("$#")); do
  if [ "-electron" = $1 ]; then
    RUN_MODULE="electron"
  fi
  if [ "-vite" = $1 ]; then
    RUN_MODULE="vite"
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
  if [ "$RUN_MODULE" = "electron" ]; then
    FULL_ARGS="npm run --prefix ./client ${MODE}:electron"
  fi

  if [ "$RUN_MODULE" = "vite" ]; then
    FULL_ARGS="npm run --prefix ./client ${MODE}:vite"
  fi

  if [ "$FULL_ARGS" = "" ]; then
    echo 'you should choose module option (-electron, -vite)'
    exit 1
  fi

  echo RUN_MODULE : ${RUN_MODULE}
  echo MODE : ${MODE}
  echo FULL_ARGS : "${FULL_ARGS}"
  ${FULL_ARGS}

fi
