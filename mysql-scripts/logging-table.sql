create table if not exists hubitat_logging.logs
(
  row_id INT(10) auto_increment
    primary key,
  name   VARCHAR(1000) null,
  msg    VARCHAR(8000) null,
  id     INT(10)       null,
  time   DATETIME(19)  null,
  type   VARCHAR(15)   null,
  level  VARCHAR(50)   null
);

