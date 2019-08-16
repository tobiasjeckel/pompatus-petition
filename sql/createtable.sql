DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    firstname VARCHAR not null,
    lastname VARCHAR not null,
    signature TEXT not null
);
