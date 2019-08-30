#!/bin/bash
# This script runs the circle ci build on your local machine.
# You can install the circle ci commandline tool with the following commands:
#

# errcho echos to stderr
errcho(){
    echo -e "$@" >&2
}

# get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "$(which circleci)" ]; then
    errcho "Installing circleci"
    curl -o /usr/local/bin/circleci https://circle-downloads.s3.amazonaws.com/releases/build_agent_wrapper/circleci
    chmod +x /usr/local/bin/circleci
else
    errcho "circleci already installed."
fi

# Build locally using circle ci
circleci build
