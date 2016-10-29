#!/usr/bin/perl

# Start the database, appending output to db.log,
#  running in background.
system("mongod --dbpath ../Blog-Database/db >> ./db.log &");

# Start the server, appending output to server.log,
#  running in background.
system("npm start >> ./server.log &");

# Wait a moment, to let the server startup prior to running tests.
sleep(2);

# Run tests on the server, appending output to test.log,
#  running in background.
system("npm test >> ./test.log");
