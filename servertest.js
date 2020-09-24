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
    inquirer
        .prompt({
            name: "options",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "View All Employees by Role",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager"
            ]
        })
        .then(function (answer) {
            switch (answer.options) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View All Employees by Department":
                    viewAllEmployeesByDepartment();
                    break;

                case "View All Employees by Manager":
                    viewAllEmployeesByManager();
                    break;

                case "View All Employees by Role":
                    viewAllEmployeesByRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
            }
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
            })
    })

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
            // choices: roleChoices
        },
        {
            name: "employeeManager",
            type: "list",
            message: "Who is the Employee's Manager?"
        }
        ])
        .then(answers => {
            //syntax for adding row to table in db
            connection.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?)", [answers.firstName, answers.lastName, answers.employeeManager, answers.employeeRole], function (err, res) {
                if (err) throw err;
            });
            runTracker();
        })
};


function removeEmployee() {
    inquirer
        .prompt(
            {
                name: "empToRemove",
                type: "list",
                message: "Which Employee do you want to remove?"
            }
        )
        .then(answers => {
            connection.query("DELETE FROM employee WHERE first_name = ?", [answers.empToRemove], (id, first_name, last_name, role_id) => {
                if (err) throw err;
            });
            runTracker();
        })
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
    inquirer
        .prompt([
            {
                name: "managerUpdate",
                type: "list",
                message: "Which Employee's Manager do you want to update?"
            },
            {
                name: "setManager",
                type: "list",
                message: "Which Employee do you want to set as Manager for the selected Employee?"
            }
        ])
        .then(answers => {
            //syntax for updating manager column in db for specific employee
            connection.query("UPDATE plans SET manager = ? WHERE id = ?", [req.body.plan, req.params.id], function (err, result) {
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
