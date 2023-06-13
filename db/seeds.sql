INSERT INTO departments (department)
VALUES ("Cleaner"),
       ("Chef"),
       ("Waiter");

INSERT INTO roles (title, department_id, salary) 
VALUES ("Jantor", 1, 35000), 
("Line Chef", 2, 40000), 
("Head Chef", 2, 50000), 
("Busser", 3, 30000);

INSERT INTO employees (first_name, last_name, manager, roles_id, department_id) 
VALUES ("Kevin", "Lastname", "Boss", 1, 1), 
("Firstname", "Kevin", "Boss", 2, 2), 
("Worker", "Lastname", "Boss", 3, 2), 
("Guy", "Alastname", "Boss", 4, 3), 
("Toptext", "Bottomtext", "Boss", 4, 3);