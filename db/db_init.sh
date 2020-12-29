#!/bin/bash
#
# A short script to set up the databse, user, tables and indices. 

if [ "$( sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='list_palette'" )" = '1' ]
then
    echo "Database already exists.  Nothing changed."
else
    echo "Creating list_palette database..."
    sudo -u postgres psql -f ./db_config.sql
fi
# 