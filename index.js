// grabs object out of user_interface file
const DataInput = require("./lib/user_interface");
const user = new DataInput();
const functionList = [user.showDepartments, user.showRoles, user.showEmployee, user.departments, user.roles, user.employees, user.updatesEmployee];

// routes user to desired function
async function selector(selection) {
    for (var i = 0; i < user.choice.length; i++) {
        if (selection === user.choice[i]) {
            await functionList[i]();
                return true;
        }
    }
    return false;
}

// function to initialize
async function init(){
    let continueApp = true;
    while (continueApp) {
        await user.setQuerry().then(async (results) => {
            constinueApp = await selector(results.route);
        })
    }
}

// starts app
init();