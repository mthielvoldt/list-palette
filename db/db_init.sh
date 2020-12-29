#!/bin/bash
#
# A short script to set up the databse, user, tables and indices. 

if [ "$( psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='list_palette'" )" = '1' ]
then
    echo "Database already exists.  Nothing changed."
else
    echo "Creating list_palette database..."
    psql -U postgres \
        -v ON_ERROR_STOP=1 \
        -v lp_password=$LP_PASS \
        -f /docker-entrypoint-initdb.d/sql/db_init.sql
fi
# 