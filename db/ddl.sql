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
)