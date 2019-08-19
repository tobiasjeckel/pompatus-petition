DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    signature TEXT not null CHECK (signature !=''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR not null CHECK (firstname !=''),
    lastname VARCHAR not null CHECK (lastname !=''),
    email VARCHAR not null UNIQUE CHECK (email !=''),
    password VARCHAR not null CHECK (password !=""),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
