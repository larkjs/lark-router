#!/bin/bash

path=$(dirname $0)
path=${path/\./$(pwd)}

cd $path/..

node_modules/.bin/easy release -v 0.11.9
