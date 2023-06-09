const inquirer = require("inquirer");

// stores data and moves use into querry 
class DataInput {
constructor(choices){
    this.choices = ["View all departments", "View all roles", "View all employees", "Add department", "Add role", "Add employee", "Update employee role"];
}

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

// class Employee extends DataInput {}

// class Roles extends DataInput {}

// class Departments extends DataInput {}


const me = new DataInput();
