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
constructor(choice, route){
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

// will querry for employee insert
async employee () {
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
        db.execute("SELECT id FROM departments WHERE department = ?", [info.dep], (err, results) =>{
            if (err) {
                console.log(err);
            }
            id = results[0].id;
            console.log(id);
        });

        // db.execute("INSERT INTO roles (title, department_id, salary) VALUES(?, ?, ?)", [info.name,  , info.salary]);
        // console.log("Roles has been added");
    })
}

// async roles () {
//     return await inquirer
//     .prompt
// }

async departments () {
    return await inquirer
    .prompt ([
        {
        type: "input",
        name: "dep",
        message: "What is the name of the department?"
        }
    ])
    .then((info) => {
        db.execute("INSERT INTO departments (department) VALUES(?)", [info.dep]);
        console.log("Department has been added");
    });
}
}

db.query(
    'SELECT department FROM departments',
    function(err, results, fields) {
        let role = results;
        console.log(role);
    }
  );

const me = new DataInput();
me.setQuerry().then(() => {
    me.employee();
});
