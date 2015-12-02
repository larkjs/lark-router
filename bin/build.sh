#!/bin/bash

path=$(dirname $0)
path=${path/\./$(pwd)}

cd $path/..

node_modules/.bin/easy release -v 4.0.0
