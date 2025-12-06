-- Script de inicialização do MySQL para CRUD System
-- Executado automaticamente quando o container é criado

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS crud_db;
USE crud_db;

-- Criar usuário 'user' com todos os privilégios
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON crud_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Criar usuário 'laravel' também (para compatibilidade)
CREATE USER IF NOT EXISTS 'laravel'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON crud_db.* TO 'laravel'@'%';
FLUSH PRIVILEGES;

-- Mostrar status
SELECT '✅ MySQL inicializado com sucesso!' as message;
SELECT CONCAT('Database: crud_db') as info;
SELECT CONCAT('Usuário: user') as user_info;
SELECT CONCAT('Senha: password') as password_info;
