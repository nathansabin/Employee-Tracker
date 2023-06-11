// sets up inquirer and mysql database
const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "nerd",
    database: "company_db"
});

// stores data and moves use into querry 
class DataInput {
constructor(choice){
    this.choice = ["View all departments", "View all roles", "View all employees", "Add department", "Add role", "Add employee", "Update employee role"];
}

// set ups what path the user will go into
// TODO: route to other functions based off of this 
async setQuerry () {
    return await inquirer
    .prompt([
        {
            type: "list",
            name: "route",
            message: "Select one of the following to view ",
            choices: this.choice
        }
    ])
    .then((info) => {
        this.route = info.route;
        });
} 

// adds data to the roles table
async roles () {

    // creates a variable that has the department name of every thing in the database
    const roles = [];
    await db.execute(
        'SELECT department FROM departments',
        (err, results) => {
            if (err) {
                console.log(err);
            }
            
            for (let i = 0; i < results.length; i++) {
                roles.push(results[i].department);
            }
          });

    // prompts user
    return inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of that role"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of that role?"
        },
        {
            type: "list",
            name: "dep",
            message: "Which department does the role belong to?",
            choices: roles
        }
    ])

    // inserts back into the datatable
    .then((info) => {
        let id;
        db.execute("SELECT id FROM departments WHERE department = ?", [info.dep], (err, results) => {
            if (err) {
                console.log(err);
            }
            id = results[0].id;
            db.execute("INSERT INTO roles (title, department_id, salary) VALUES(?, ?, ?)", [info.name, id, info.salary]);
            console.log("Roles has been added");
        });
    });
}

// Adds data to employees
async employees () {
    const idList = [];
    const titleList = [];
    const departmentList = [];
    await db.execute(
        'SELECT title, id, department_id FROM roles',
        (err, results) => {
            if (err) {
                console.log(err);
            }
            
            for (let i = 0; i < results.length; i++){
                titleList.push(results[i].title);
                idList.push(results[i].id);
                departmentList.push(results[i].department_id);
            }
            return inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?"
                },
                {
                    type: "input",
                    name: "manager",
                    message: "Who is the manger?"
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is there job title?",
                    choices: titleList
                }
            ])
        
            // adds data
            .then((info) => {
                let id;
                let dep_id;
                for (let i = 0; i < titleList.length; i++) {
                    if (info.role === titleList[i]) {
                        id = idList[i];
                        dep_id = departmentList[i];
                        console.log("Employee was added");
                        db.execute("INSERT INTO employees (first_name, last_name, manager, roles_id, department_id) VALUES (?, ?, ?, ?, ?)", [info.firstName, info.lastName, info.manager, id, dep_id]);
                    }
                }
            });
          });

}

// adds a department to the table 
async departments () {

    // pulls data from user
    return await inquirer
    .prompt ([
        {
        type: "input",
        name: "dep",
        message: "What is the name of the department?"
        }
    ])

    //adds info to table
    .then((info) => {
        db.execute("INSERT INTO departments (department) VALUES(?)", [info.dep]);
        console.log("Department has been added");
    });
}

// displays department info
async showDepartments() {
    db.query("SELECT * FROM departments", (err, results, feilds) => {
        console.table(results);
    });
}

// displays role info
async showRoles() {
    db.query("SELECT * FROM roles JOIN departments ON roles.department_id = departments.id", (err, results) => {
        console.table(results);
    });
}

// displays employee info
async showEmployee() {
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees JOIN roles ON employees.roles_id = roles.id JOIN departments ON employees.department_id = departments.id", (err, results) => {
        console.table(results);
    });
}
}

const me = new DataInput();

me.setQuerry().then(() => {
    me.showEmployee();
});
