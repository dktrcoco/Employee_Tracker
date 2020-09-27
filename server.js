//DEPENDENCIES
//====================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");
// var cTable = require("console.table"); writing console.table("tableName") will suffice as per my tutor

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    //password for accessing DB
    password: "24DimethylPyrrole!",
    //selecting specific DB to query
    database: "employeeTracker_DB"
});

connection.connect(function (err) {
    try {
        if (err) throw err;
        runTracker();
    } catch (error) {
        console.log(error);
    };
});

function runTracker() {
    //associative array, indexing it based on the selection from user
    //and mapping it to the associated function
    const funcs = {
        "View All Employees": viewAllEmployees,
        "View All Employees by Department": viewAllEmployeesByDepartment,
        "View All Employees by Manager": viewAllEmployeesByManager,
        "View All Employees by Role": viewAllEmployeesByRole,
        "Add Employee": addEmployee,
        "Add Department": addDepartment,
        "Remove Employee": removeEmployee,
        "Add Role": addRole,
        "Remove Role": removeRole,
        "Remove Department": removeDepartment,
        "Update Employee Role": updateEmployeeRole,
        "Update Employee Manager": updateEmployeeManager,
        "Department Overhead": salaryOfDepartment,
        "I'm Done": taskComplete
    }

    inquirer
        .prompt({
            name: "options",
            type: "rawlist",
            message: "What would you like to do?",
            choices: Object.keys(funcs),
            pageSize: 15 //this allows for a better display regardless of the number of choices
        })
        .then(function (answer) {
            // console.log(answer.options);
            funcs[answer.options]();
        });
}

//displays all employees along with their role (title), salary, department, and manager
function viewAllEmployees() {

    //defining the call to the DB with the syntax that will display the data requested using JOINS
    var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
        'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
        'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
        'LEFT JOIN employee em ON e.manager_id = em.id ' +
        'INNER JOIN department d ON r.department_id = d.id';

    //connects to the DB and returns the data as constructed in var sql
    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    runTracker();
};

//allows for the selection of a department and displays all employees that are part of that department
function viewAllEmployeesByDepartment() {

    //defining what I want to pull from the department table from employeeTracker_DB
    var dept = 'SELECT * FROM department';
    connection.query(dept, function (err, res) {
        if (err) throw err;

        //mapping the department table and pulling the columns I need
        const departmentChoices = res.map(({
            id, name
        }) => ({
            name: name,
            value: id
        }))
        inquirer
            .prompt(
                {
                    name: "deptFilter",
                    type: "list",
                    message: "Which Department's Employees do you want to see?",
                    choices: departmentChoices,
                    pageSize: departmentChoices.length //this allows for a better display regardless of the number of choices
                }
            )

            .then(answers => {

                //defining the call to the DB with the syntax that will display the data requested using JOINS
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE d.id = ' + answers.deptFilter;

                //connects to the DB and returns the data as constructed in var sql
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            });
    });

};

//allows for the selection of a manager and displays all employees that report to that manager
function viewAllEmployeesByManager() {

    //defining what I want to pull from the employee table
    var manager = 'SELECT * FROM employee';
    connection.query(manager, function (err, res) {
        if (err) throw err;

        //mapping the employee table and pulling the columns I need
        const managerChoices = res.map(({
            id, first_name, last_name
        }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        inquirer
            .prompt(
                {
                    name: "managerFilter",
                    type: "list",
                    message: "Which Manager's Employees do you want to see?",
                    choices: managerChoices,
                    pageSize: managerChoices.length //this allows for a better display regardless of the number of choices
                }
            )
            .then(answers => {

                //defining the call to the DB with the syntax that will display the data requested using JOINS
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE em.id = ' + answers.managerFilter;

                //connects to the DB and returns the data as constructed in var sql
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            })
    })
};

//allows for the selection of a role and displays all employees with that role
function viewAllEmployeesByRole() {

    //defining what I want to pull from the role table
    var role = 'SELECT * FROM role';
    connection.query(role, function (err, res) {
        if (err) throw err;

        //mapping the role table and pulling the columns I need
        const roleChoices = res.map(({
            id, title
        }) => ({
            name: title,
            value: id
        }))
        inquirer
            .prompt(
                {
                    name: "roleFilter",
                    type: "list",
                    message: "Which Role would you like to search?",
                    choices: roleChoices,
                    pageSize: roleChoices.length //this allows for a better display regardless of the number of choices
                }
            )
            .then(answers => {

                //defining the call to the DB with the syntaxthat will display the data requested using JOINS
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE r.id = ' + answers.roleFilter;

                //connects to the DB and returns the data as constructed in var sql
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            })
    })
};

//allows for the addition of an employee to the employee table from the employeeTracker_DB
function addEmployee() {
    try {

        //defining what I want to pull from the employee and role tables
        //There are two because I'm pulling from two different tables
        var manager = 'SELECT * FROM employee';
        var role = 'SELECT * FROM role';

        //The below connections are nested, allowing for the pulling of data from both tables for the inquiry questions
        connection.query(manager, function (err, res) {
            if (err) throw err;

            //mapping the employee table and pulling the columns I need
            const managerChoices = res.map(({
                id, first_name, last_name
            }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            connection.query(role, function (err, res) {
                if (err) throw err;

                //mapping the role table and pulling the columns I need
                const roleChoices = res.map(({
                    id, title
                }) => ({
                    name: title,
                    value: id
                }));
                inquirer
                    .prompt([{
                        name: "firstName",
                        type: "input",
                        message: "What is the Employee's first name?"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the Employee's last name?"
                    },
                    {
                        name: "employeeManager",
                        type: "list",
                        message: "Who is the Employee's Manager?",
                        choices: managerChoices,
                        pageSize: managerChoices.length //this allows for a better display regardless of the number of choices
                    },
                    {
                        name: "employeeRole",
                        type: "list",
                        message: "What is the Employee's role?",
                        choices: roleChoices,
                        pageSize: roleChoices.length, //this allows for a better display regardless of the number of choices
                        askAnswered: true
                    }
                    ])
                    .then(answers => {

                        //syntax for adding row (data for each required column) to employee table in employeeTracker_DB
                        connection.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)", [answers.firstName, answers.lastName, answers.employeeManager, answers.employeeRole], function (err, res) {
                            console.log(err);
                            if (err) throw err;
                            console.log("");
                            runTracker();
                        });
                    });
            });

        });
    } catch (error) { console.log(error) };
};

//allows for the addition of a department to the department table from the employeeTracker_DB
function addDepartment() {

    inquirer
        .prompt(
            {
                name: "deptToAdd",
                type: "input",
                message: "What is the name of the Department you want to add?"
            }
        )
        .then(answers => {

            //syntax for adding inputted data to the department table in the employeeTracker_DB
            connection.query('INSERT INTO department (name) VALUES (?)', [answers.deptToAdd], function (err, res) {
                if (err) throw err;
                console.log("");
                runTracker();
            });
        });
};

//allows for the addition of a role to the role table from the employeeTracker_DB
function addRole() {

    //defining what I want to pull from the department table
    var dept = 'SELECT * FROM department';
    connection.query(dept, function (err, res) {
        if (err) throw err;

        //mapping the department table and pulling the columns I need
        const departmentChoices = res.map(({
            id, name
        }) => ({
            name: name,
            value: id
        }))
        inquirer
            .prompt([
                {
                    name: "roleToAdd",
                    type: "input",
                    message: "What is the name of the Role you want to add?"
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "What is the salary for the new Role?"
                },
                {
                    name: "roleDepartment",
                    type: "list",
                    message: "which Department will this new Role work in?",
                    choices: departmentChoices,
                    pageSize: departmentChoices.length //this allows for a better display regardless of the number of choices
                }
            ])
            .then(answers => {

                //syntax for adding inputted data into the role table and columns in the DB
                connection.query('INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)', [answers.roleToAdd, answers.roleSalary, answers.roleDepartment], function (err, res) {
                    if (err) throw err;
                    console.log("");
                    runTracker();
                });
            });
    });
};

//allows for the selection of a department and tallies the total of all department member's salary
function salaryOfDepartment() {

    //defining dept as what I want to pull from the department table
    var dept = 'SELECT * FROM department';

    //connecting to the DB
    connection.query(dept, function (err, res) {
        if (err) throw err;

        //mapping the department table and pulling the columns I need
        const departmentChoices = res.map(({
            id, name
        }) => ({
            name: name,
            value: id
        }))
        inquirer
            .prompt(
                {
                    name: "deptFilter",
                    type: "list",
                    message: "Which Department's Total Salary do you want to see?",
                    choices: departmentChoices,
                    pageSize: departmentChoices.length  //this allows for a better display regardless of the number of choices
                }
            )
            .then(answers => {

                //defining the call to the DB with the syntax that will display the data requested using JOINS
                var sql = 'SELECT department.name AS department, role.salary FROM employee e LEFT JOIN ' +
                    'employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN ' +
                    'department ON role.department_id = department.id WHERE department.id = ?'

                connection.query(sql, [answers.deptFilter], function (err, res) {
                    //a try/catch to error test
                    try {
                        if (err) throw err;
                        console.log("");

                        //defining variable to hold the eventual salary total
                        let sum = 0;

                        //looping over the salary data pulled from the DB
                        for (let i = 0; i < res.length; i++) {

                            //adding each salary to the variable 'sum'
                            sum += res[i].salary;
                        }

                        //if statement that routes to displaying the salary of the requested department...
                        if (res.length > 0) {
                            console.log("The Total Salary for the " + res[0].department + " department: $" + sum + "\n");
                        }

                        //Or notifying the User that there are no employees in the requested department
                        else {
                            console.log("There are no employees in this department." + "\n");
                        }
                        runTracker();
                    } catch (errur) {
                        console.log(errur);
                    }
                });
            });
    });
};

//allows for the removal of an employee from the employee table from the employeeTracker_DB
function removeEmployee() {

    //defining what I want to pull from the employee table
    var employee = 'SELECT * FROM employee';

    connection.query(employee, function (err, res) {
        if (err) throw err;

        //mapping over the employee table and pulling the columns I need
        const employeeChoices = res.map(({
            id, first_name, last_name
        }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        inquirer
            .prompt(
                {
                    name: "empToRemove",
                    type: "list",
                    message: "Which Employee do you want to remove?",
                    choices: employeeChoices,
                    pageSize: employeeChoices.length //this allows for a better display regardless of the number of choices
                }
            )
            .then(answers => {

                //syntax used for deleting data from the employee table
                //This will delete the entire row based on what id is chosen
                connection.query("DELETE FROM employee WHERE id = (?)", [answers.empToRemove], function (err, res) {
                    console.log(err);
                    if (err) throw err;
                    runTracker();
                });
            });
    });
};

//allows for the removal of a department from the department table from the employeeTracker_DB
function removeDepartment() {

    //defining what I want to pull from the department table
    var dept = 'SELECT * FROM department';

    connection.query(dept, function (err, res) {
        if (err) throw err;

        //mapping the department table and pulling the columns I need
        const deptChoices = res.map(({
            id, name
        }) => ({
            name: name,
            value: id
        }));
        inquirer
            .prompt(
                {
                    name: "deptToRemove",
                    type: "list",
                    message: "Which Department do you want to remove?",
                    choices: deptChoices,
                    pageSize: deptChoices.length //this allows for a better display regardless of the number of choices
                }
            )
            .then(answers => {

                //syntax for deleting data from the department table
                connection.query("DELETE FROM department WHERE id = (?)", [answers.deptToRemove], function (err, res) {
                    console.log(err);
                    if (err) throw err;
                    runTracker();
                });
            });
    });
};

//allows for the removal of a role from the role table from the employeeTracker_DB
function removeRole() {

    //defining what I want to pull from the role table
    var role = 'SELECT * FROM role';
    connection.query(role, function (err, res) {
        if (err) throw err;

        //mapping over the role table and pulling the columns I need
        const roleChoices = res.map(({
            id, title
        }) => ({
            name: title,
            value: id
        }))
        inquirer
            .prompt([
                {
                    name: "roleToRemove",
                    type: "list",
                    message: "which Role would you like to remove?",
                    choices: roleChoices,
                    pageSize: roleChoices.length //this allows for a better display regardless of the number of choices
                }
            ])
            .then(answers => {

                //syntax for deleting data from the role table
                connection.query('DELETE FROM role WHERE id = (?)', [answers.roleToRemove], function (err, res) {
                    if (err) throw err;
                    console.log("");
                    runTracker();
                });
            });
    });
};

//allows for selection of an employee and setting their role
function updateEmployeeRole() {

    //defining what I want to pull from the employee and role tables
    //There are two because I'm pulling from two different tables
    var employee = 'SELECT * FROM employee';
    var role = 'SELECT * FROM role';

    //The below connections are nested, allowing for the pulling of data from both employee and role tables for the inquiry questions
    connection.query(employee, function (err, res) {
        if (err) throw err;

        //mapping over the employee table and pulling the columns I need
        const employeeChoices = res.map(({
            id, first_name, last_name
        }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        //mapping over the role table and pulling the columns I need
        connection.query(role, function (err, res) {
            if (err) throw err;
            const roleChoices = res.map(({
                id, title
            }) => ({
                name: title,
                value: id
            }));

            inquirer
                .prompt([
                    {
                        name: "empToUpdateRole",
                        type: "list",
                        message: "Which Employee's Role do you want to update?",
                        choices: employeeChoices,
                        pageSize: employeeChoices.length //this allows for a better display regardless of the number of choices
                    },
                    {
                        name: "setRole",
                        type: "list",
                        message: "Which Role do you want to set as the new Role for the selected Employee?",
                        choices: roleChoices,
                        pageSize: roleChoices.length //this allows for a better display regardless of the number of choices
                    }
                ])
                .then(answers => {

                    //syntax for updating role_id column in db for specific employee
                    connection.query("UPDATE employee SET role_id = (?) WHERE id = (?)", [answers.setRole, answers.empToUpdateRole], function (err, result) {
                        if (err) throw err;
                        console.log("");
                        runTracker();
                    });
                });
        });
    });
};

//allows for selection of an employee and setting their manager
function updateEmployeeManager() {

    //defining what I want to pull from the employee table
    var manager = 'SELECT * FROM employee';
    connection.query(manager, function (err, res) {
        if (err) throw err;

        //mapping over the employee table and pulling the columns I need
        const managerChoices = res.map(({
            id, first_name, last_name
        }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        inquirer
            .prompt([
                {
                    name: "managerUpdate",
                    type: "list",
                    message: "Which Employee's Manager do you want to update?",
                    choices: managerChoices,
                    pageSize: managerChoices.length//this allows for a better display regardless of the number of choices
                },
                {
                    name: "setManager",
                    type: "list",
                    message: "Which Employee do you want to set as Manager for the selected Employee?",
                    choices: managerChoices,
                    pageSize: managerChoices.length //this allows for a better display regardless of the number of choices
                }
            ])
            .then(answers => {

                //syntax for updating manager_id column in db for specific employee
                connection.query("UPDATE employee SET manager_id = (?) WHERE id = (?)", [answers.setManager, answers.managerUpdate], function (err, result) {
                    if (err) throw err;
                    console.log("");
                    runTracker();
                });
            });
    });
};

//terminates connection in node
function taskComplete() {
    connection.end();
};





//functions I was testing
// function listAllEmployees() {
//     var employeeQuery = 'SELECT * FROM employee';
//     var employees;
//     connection.query(employeeQuery, function (err, res) {
//         if (err) throw err;
//         employees = res.map(({
//             id, first_name, last_name
//         }) => ({
//             name: `${first_name} ${last_name}`,
//             value: id
//         }))
//         console.log(employees);
//     });
//     console.log(employees);
//     return employees;
// }

// function listAllEmployees() {
//     var employeeQuery = 'SELECT * FROM employee';
//     connection.query(employeeQuery, function (err, res) {
//         if (err) throw err;
//         const employees = res.map(({
//             id, first_name, last_name
//         }) => ({
//             name: `${first_name} ${last_name}`,
//             value: id
//         }))
//     }
// return employees;
// }



// function listAllRoles() {
//     var roleQuery = 'SELECT * FROM role';
//     connection.query(roleQuery, function (err, res) {
//         if (err) throw err;
//         const roleChoices = res.map(({
//             id, title
//         }) => ({
//             name: title,
//             value: id
//         }))
//         return roleChoices;
//     };