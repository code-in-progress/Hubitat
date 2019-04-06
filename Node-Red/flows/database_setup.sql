CREATE DATABASE IF NOT EXISTS hubitat_logging;

-- CHANGE THE LINE BELOW TO A SECURE PASSWORD!!!

CREATE USER 'hubitat_logger'@'localhost' IDENTIFIED BY 'PASSWORD'; 
GRANT EXECUTE, PROCESS, SELECT, SHOW DATABASES, SHOW VIEW  ON *.* TO 'hubitat_logger'@'localhost'; GRANT EXECUTE, SELECT, SHOW VIEW, INSERT, UPDATE  ON `hubitat\_logging`.* TO 'hubitat_logger'@'localhost';
FLUSH PRIVILEGES;

USE hubitat_logging;

create table IF NOT EXISTS batteries (
	id int(10) auto_increment primary key,
	deviceId int(10) null,
	displayName varchar(500) null,
	value decimal(10,2) null,
	created timestamp default current_timestamp() not null
);

create table IF NOT EXISTS events (
	row_id int auto_increment primary key,
	source varchar(20) null,
	name varchar(100) null,
	displayName varchar(1500) null,
	value varchar(2500) null,
	unit varchar(50) null,
	deviceId int null,
	hubId int null,
	locationId int null,
	installedAppId int null,
	descriptionText text null,
	created timestamp default current_timestamp() not null
);

create table IF NOT EXISTS logs (
	row_id int auto_increment primary key,
	name varchar(1000) null,
	msg varchar(8000) null,
	id int null,
	time datetime null,
	type varchar(15) null,
	level varchar(50) null
);

create table IF NOT EXISTS motions (
	id int(10) auto_increment primary key,
	deviceId int(10) null,
	displayName varchar(500) null,
	value varchar(20) null,
	created timestamp default current_timestamp() not null
);

create table IF NOT EXISTS switches (
	id int(10) auto_increment primary key,
	deviceId int(10) null,
	displayName varchar(500) null,
	value varchar(20) null,
	created timestamp default current_timestamp() not null
);

create table IF NOT EXISTS temperatures (
	id int auto_increment primary key,
	deviceId int null,
	displayName varchar(500) null,
	value decimal(10,2) null,
	created timestamp default current_timestamp() not null
);

create index batteries_created_index on batteries (created);
create index batteries_deviceId_index on batteries (deviceId);
create index motions_created_index  on motions (created);
create index motions_deviceId_index on motions (deviceId);
create index switches_created_index on switches (created);
create index switches_deviceId_index on switches (deviceId);
create index temperatures_created_index on temperatures (created);
create index temperatures_deviceId_index on temperatures (deviceId);
