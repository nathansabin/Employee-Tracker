// grabs object out of user_interface file
const DataInput = require("./lib/user_interface");
const user = new DataInput();
const functionList = [user.showDepartments, user.showRoles, user.showEmployee, user.departments, user.roles, user.employees];

// routes user to desired function
async function selector(selection) {
    for (var i = 0; i < user.choice.length; i++) {
        if (selection === user.choice[i]) {
            functionList[i]().then(() =>{
                return init();
            });
        }
    }
}

// function to initialize
async function init(){
    await user.setQuerry()
    .then((results) => {
        return selector(results.route);
    });
}

// starts app
init();