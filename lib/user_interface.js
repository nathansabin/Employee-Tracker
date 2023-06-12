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
async setQuerry () {
    return await inquirer
    .prompt([
        {
            type: "list",
            name: "route",
            message: "Select one of the following to view ",
            choices: this.choice
        }
    ]);
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
    return await inquirer
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
    db.execute(
        'SELECT title, id, department_id FROM roles',
        async (err, results) => {
            if (err) {
                console.log(err);
            }
            
            for (let i = 0; i < results.length; i++){
                titleList.push(results[i].title);
                idList.push(results[i].id);
                departmentList.push(results[i].department_id);
            }
          })

          return await inquirer
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
    db.execute("SELECT * FROM departments", async(err, results) => {
        const data = results;
        console.log("\n");
        return await console.table(data);   
    });
}

// displays role info
async showRoles() {
    db.execute("SELECT * FROM roles JOIN departments ON roles.department_id = departments.id", async(err, results) => {
        const data = results;
        console.log("\n");
        return await console.table(data);
    });
}

// displays employee info
async showEmployee() {
    // "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees JOIN roles ON employees.roles_id = roles.id JOIN departments ON employees.department_id = departments.id"
    db.execute("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees JOIN roles ON employees.roles_id = roles.id JOIN departments ON employees.department_id = departments.id", async(err, results) => {
        const data = results;
        console.log("\n");
        return await console.table(data);
    });
    }

// updates data
async updatesEmployee() {
    const idList = [];
    const idRole = [];
    const name = [];
    const titleList = [];
    db.execute(
        "SELECT employees.first_name, employees.last_name, roles.title, employees.roles_id, employees.id FROM employees JOIN roles ON employees.roles_id = roles.id",
        async (err, results) => {
            if (err) {
                console.log(err);
            }
            
            for (let i = 0; i < results.length; i++){
                idList.push(results[i].id);
                idRole.push(results[i].roles_id);
                titleList.push(results[i].title);
                name.push(results[i].first_name + " " + results[i].last_name);
            }

            return await inquirer
            .prompt([
                {
                    type: "list",
                    name: "worker",
                    message: "What is the workers name?",
                    choices: name
                },
                {
                    type: "list",
                    name: "newRole",
                    message: "What is there new position?",
                    choices: titleList
                }
            ]).then(async(results) => {
            // adds data
            const selectedWorker = results.worker;
            const selectedRole = results.newRole;
      
            const workerIndex = name.indexOf(selectedWorker);
            const roleId = idRole[workerIndex];
      
            const roleIndex = titleList.indexOf(selectedRole);
            const newRoleId = idRole[roleIndex];
      
            const workerId = idList[workerIndex];
      
            await db.execute("UPDATE employees SET roles_id = ? WHERE id = ?", [newRoleId, workerId], (err, results) => {
                console.log("Employee role updated");
              }
            )
            });
        });
        
}  
}

module.exports = DataInput;