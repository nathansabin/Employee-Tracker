-- Recreates database and makes it active
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
use company_db;

-- Departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- Roles table 
CREATE TABLE roles (
    id INT AUTO_INCREMENT,
    title VARCHAR(35) NOT NULL,
    department_id INT NOT NULL,
    salary INT NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE,
    PRIMARY KEY (id)
);

-- employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager VARCHAR(30) NOT NULL,
    roles_id INT NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (roles_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);