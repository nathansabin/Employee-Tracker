const inquirer = require("inquirer");

// stores data and moves use into querry 
class DataInput {
constructor(){}

async setQuerry () {
    const choice = ["employees", "roles", "departments"]
    return await inquirer
    .prompt([
        {
            type: "list",
            name: "route",
            message: "Select one of the following to view ",
            choices: choice
        }
    ])
    .then()
} 

async employee () {
    return await inquirer
    .prompt
}

async roles () {
    return await inquirer
    .prompt
}

async departments () {
    return await inquirer
    .prompt 
}
}

//
class Employee extends DataInput {}

class Roles extends DataInput {}

class Departments extends DataInput {}



