CREATE DATABASE  IF NOT EXISTS conectar;

CREATE USER 'admin'@'%' IDENTIFIED BY 'admin';
GRANT all ON conectar.* TO 'admin'@'%';