create table if not exists hubitat_logging.events
(
  row_id          INT(10) auto_increment
    primary key,
  source          VARCHAR(20)                             null,
  name            VARCHAR(100)                            null,
  displayName     VARCHAR(1500)                           null,
  value           VARCHAR(2500)                           null,
  unit            VARCHAR(50)                             null,
  deviceId        INT(10)                                 null,
  hubId           INT(10)                                 null,
  locationId      INT(10)                                 null,
  installedAppId  INT(10)                                 null,
  descriptionText TEXT(65535)                             null,
  created         TIMESTAMP(19) default CURRENT_TIMESTAMP not null
);