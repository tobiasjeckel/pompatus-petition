DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    firstname VARCHAR not null CHECK (firstname !=''),
    lastname VARCHAR not null CHECK (lastname !=''),
    signature TEXT not null CHECK (signature !='')
);
