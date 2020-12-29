 CREATE DATABASE list_palette;

CREATE USER list_palette_user; 

\password list_palette_user
\c list_palette
-- UNIQUE constraint should auto-generate an index on email, so I don't need to create one explicitely
CREATE TABLE users (
    user_id serial PRIMARY KEY, -- UNIQUE NOT NULL are implied
    email varchar(100) UNIQUE, 
    name varchar(100) CONSTRAINT username_not_null NOT NULL,
    password varchar(300) NOT NULL
);

-- item_id will be provided by front-end, but will be checked by db for uniqueness in combination with user_id. 
CREATE TABLE items (
    user_id integer NOT NULL REFERENCES users ON DELETE CASCADE,
    item_id integer NOT NULL,   -- 
    item_text varchar(4000) NOT NULL,
    item_status varchar(30),
    item_next integer, 
    item_child integer,
    PRIMARY KEY (user_id, item_id)  -- Implies UNIQUE for this pair (but not each one individually)
);

/**
I will be frequently querying for all the items associated with a specific user_id.  
Accordingly I will benefit from having an index.
REFERENCES (making user_id a foreign key) does not create this index automatically. 
I chose the HASH index because there is no useful significance to one user_id being > another. 
I only care whether I have the correct (==) user or not. 
**/
CREATE INDEX items_user_index ON items USING HASH (user_id);

GRANT ALL PRIVILEGES ON DATABASE list_palette TO list_palette_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO list_palette_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO list_palette_user;