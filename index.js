// grabs object out of user_interface file
const DataInput = require("./lib/user_interface");
const user = new DataInput();

// routes user to desired function
async function selector() {
    return console.log("hello, world");
}

// function to initialize
async function init(){
    while (true) {
        await user.setQuerry()
        .then((results) => {
            return selector(results.route);
        });
    }
}

// starts app
init();