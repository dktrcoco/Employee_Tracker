//DEPENDENCIES
//====================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");
// var cTable = require("console.table"); writing console.table("tableName") will suffice

//
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
    if (err) throw err;
    runTracker();
});

function runTracker() {
    //associative array, indexing it based on the selection from user
    //and mapping it to the associated function
    const funcs = {
        "View All Employees": viewAllEmployees, //works
        "View All Employees by Department": viewAllEmployeesByDepartment, //works
        "View All Employees by Manager": viewAllEmployeesByManager, //works
        "View All Employees by Role": viewAllEmployeesByRole, //works
        "Add Employee": addEmployee, //works
        "Add Department": addDepartment, //works
        "Remove Employee": removeEmployee, //works
        "Add Role": addRole, //works
        "Remove Role": removeRole, //not done
        "Remove Department": removeDepartment, //not done
        "Update Employee Role": updateEmployeeRole, //not done
        "Update Employee Manager": updateEmployeeManager, //not done
        "Department Overhead": salaryOfDepartment, //not done
        "I'm Done": taskComplete //not done
    }

    inquirer
        .prompt({
            name: "options",
            type: "rawlist",
            message: "What would you like to do?",
            choices: Object.keys(funcs)
        })
        .then(function (answer) {
            console.log(answer.options);
            funcs[answer.options]();
        });
}

function viewAllEmployees() {
    //need to use console.table and pull the entire table from db
    //this requires additional syntax to pull from multiple tables
    var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
        'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
        'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
        'LEFT JOIN employee em ON e.manager_id = em.id ' +
        'INNER JOIN department d ON r.department_id = d.id';

    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    runTracker();
};

function viewAllEmployeesByDepartment() {
    //need to use console.table and pull the table from db filtered by department
    var dept = 'SELECT * FROM department';
    connection.query(dept, function (err, res) {
        if (err) throw err;
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
                    choices: departmentChoices
                }
            )
            .then(answers => {
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE d.id = ' + answers.deptFilter;
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            });
    });

};

function viewAllEmployeesByManager() {
    //need to use console.table and pull the table from db filtered by manager
    var manager = 'SELECT * FROM employee';
    connection.query(manager, function (err, res) {
        if (err) throw err;
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
                    choices: managerChoices
                }
            )
            .then(answers => {
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE em.id = ' + answers.managerFilter;
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            })
    })
};

function viewAllEmployeesByRole() {
    var role = 'SELECT * FROM role';
    connection.query(role, function (err, res) {
        if (err) throw err;
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
                    choices: roleChoices
                }
            )
            .then(answers => {
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE r.id = ' + answers.roleFilter;
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            })
    })
};

function addEmployee() {
    var manager = 'SELECT * FROM employee';
    var role = 'SELECT * FROM role';

    connection.query(manager, function (err, res) {
        if (err) throw err;
        const managerChoices = res.map(({
            id, first_name, last_name
        }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        connection.query(role, function (err, res) {
            if (err) throw err;
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
                    name: "employeeRole",
                    type: "list",
                    message: "What is the Employee's role?",
                    choices: roleChoices
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Who is the Employee's Manager?",
                    choices: managerChoices
                }
                ])
                .then(answers => {
                    //syntax for adding row to table in db
                    connection.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)", [answers.firstName, answers.lastName, answers.employeeManager, answers.employeeRole], function (err, res) {
                        console.log(err);
                        if (err) throw err;

                    });
                });
        });
        runTracker();
    });
};

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
            connection.query('INSERT INTO department (name) VALUES (?)', [answers.deptToAdd], function (err, res) {
                if (err) throw err;
                console.log("");

            });
            runTracker();
        });

};

function addRole() {

    var dept = 'SELECT * FROM department';
    connection.query(dept, function (err, res) {
        if (err) throw err;
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
                    choices: departmentChoices
                }
            ])
            .then(answers => {
                connection.query('INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)', [answers.roleToAdd, answers.roleSalary, answers.roleDepartment], function (err, res) {
                    if (err) throw err;
                    console.log("");
                });
                runTracker();
            });
    });
};

function salaryOfDepartment() {
    //need to isolate
    var dept = 'SELECT * FROM department';
    connection.query(dept, function (err, res) {
        if (err) throw err;
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
                    choices: departmentChoices
                }
            )
            .then(answers => {
                var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name AS "department name",' +
                    'CONCAT(em.first_name, " ", em.last_name) AS Manager ' +
                    'FROM employee e INNER JOIN role r ON e.role_id = r.id ' +
                    'LEFT JOIN employee em ON e.manager_id = em.id ' +
                    'INNER JOIN department d ON r.department_id = d.id ' +
                    'WHERE d.id = ' + answers.deptFilter;
                connection.query(sql, function (err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    runTracker();
                });
            });
    });

};

function removeEmployee() {
    var employee = 'SELECT * FROM employee';

    connection.query(employee, function (err, res) {
        if (err) throw err;
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
                    choices: employeeChoices
                }
            )
            .then(answers => {
                connection.query("DELETE FROM employee WHERE id = (?)", [answers.empToRemove], function (err, res) {
                    console.log(err);
                    if (err) throw err;

                });
                runTracker();
            });
    });
};

function removeDepartment() {
    var dept = 'SELECT * FROM department';

    connection.query(dept, function (err, res) {
        if (err) throw err;
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
                    choices: deptChoices
                }
            )
            .then(answers => {
                connection.query("DELETE FROM department WHERE id = (?)", [answers.deptToRemove], function (err, res) {
                    console.log(err);
                    if (err) throw err;

                });
                runTracker();
            });
    });
};

function removeRole() {
    var employee = 'SELECT * FROM employee';

    connection.query(employee, function (err, res) {
        if (err) throw err;
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
                    choices: employeeChoices
                }
            )
            .then(answers => {
                connection.query("DELETE FROM employee WHERE id = (?)", [answers.empToRemove], function (err, res) {
                    console.log(err);
                    if (err) throw err;

                });
                runTracker();
            });
    });
};

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: "roleUpdate",
                type: "list",
                message: "Which Employee's Role do you want to update?"
            },
            {
                name: "setRole",
                type: "list",
                message: "Which Role do you want to set for the selected Employee?"
            }
        ])
        .then(answers => {
            //syntax for updating role column in db for specific employee
            connection.query("UPDATE plans SET role = ? WHERE employee = ?", [req.body.role, req.params.id], function (err, result) {
                if (err) {
                    // If an error occurred, send a generic server failure
                    return res.status(500).end();
                }
                else if (result.changedRows === 0) {
                    // If no rows were changed, then the ID must not exist, so 404
                    console.log(404);
                }
            });
            runTracker();
        })
};

function updateEmployeeManager() {
    var manager = 'SELECT * FROM employee';
    connection.query(manager, function (err, res) {
        if (err) throw err;
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
                choices: managerChoices
            },
            {
                name: "setManager",
                type: "list",
                message: "Which Employee do you want to set as Manager for the selected Employee?",
                choices: managerChoices
            }
        ])
        .then(answers => {
            //syntax for updating manager column in db for specific employee
            connection.query("UPDATE employee SET manager_id = (?) WHERE id = (?)", [answers.setManager, answers.managerUpdate], function (err, result) {
                if (err) throw err;
                console.log("");
            });
            runTracker();
        });
    });
};

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