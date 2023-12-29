CREATE DATABASE djtrinity;

USE djtrinity;

CREATE TABLE djtrinity.bms_node
(
    id         bigint auto_increment,
    file_name  varchar(255) not null,
    root_path  varchar(255) not null,
    created_at timestamp    not null,
    updated_at timestamp    not null,
    primary key (id)
);

CREATE TABLE djtrinity.user
(
    id         varchar(30)  not null,
    password   varchar(255) not null,
    nickname   varchar(255) unique,
    profile    varchar(255),
    created_at timestamp    not null,
    updated_at timestamp    not null,
    primary key (id)
);

CREATE TABLE djtrinity.token
(
    id                      bigint auto_increment,
    user_id                 varchar(30)  not null,
    access_token            varchar(255) not null,
    refresh_token           varchar(255) not null,
    refresh_token_used_at   timestamp,
    refresh_token_expire_at timestamp    not null,
    created_at              timestamp    not null,
    updated_at              timestamp    not null,
    primary key (id),
    INDEX                   accesstoken_refreshtoken (access_token, refresh_token)
);