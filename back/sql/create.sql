DROP FUNCTION IF EXISTS get_nonce(wallet varchar);
DROP INDEX IF EXISTS user_wallet;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS messages;

create table users (
    id bigserial primary key unique,
    wallet varchar(42) unique not null,
    nonce varchar(36) not null,
    email varchar not null default '',
    display_name varchar(100) not null default '',
    profile_picture varchar default ''
);

create index user_wallet on users(wallet);

create table requests (
    id bigserial primary key unique,
    wallet varchar(42) not null,
    message varchar not null
);

create table messages (
    id bigserial primary key unique,
    wallet varchar(42) not null,
    type int not null default 0,
    message varchar not null
);

CREATE FUNCTION get_nonce(wallet varchar(42))
RETURNS varchar(36)
LANGUAGE plpgsql
AS $$
DECLARE num int;
    ret varchar;
BEGIN
    SELECT count(id) into num FROM users WHERE users.wallet = get_nonce.wallet;
    if num != 1 then
        return NULL;
    end if;

    SELECT nonce into ret from users WHERE users.wallet = get_nonce.wallet;
    return ret;
END
$$;