#!/bin/bash

gulp js

pm2 start ./bin/www
pm2 log www
