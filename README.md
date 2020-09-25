# Employee_Tracker

This will have a CLI that takes user input, followed by displaying the requested data from a database, manipulating the data from a database, or inserting the inputted data to the database

Table of Contents
* [User Story](#story)
* [Images](#images)
* [Install](#install)
* [Contribution](#contribution)
* [Testing](#testing)
* [Questions](#questions)

## Story

AS a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business

GIVEN a command-line application that accepts user input

WHEN I am prompted for what I want to do

THEN I am given a list of choices ranaging from viewing all employees to altering the status of employees and their role/manager

WHEN I choose to view all employees

THEN a table listing all employees with their title, deparatment, salary, and manager are displayed

WHEN I choose to view all employees by department

THEN I am prompted to select a department and a table listing all employees within the chosen department with all of their information

WHEN I choose to view all employees by manager

THEN I am prompted to select a manager and a table listing all employees that report to the selected manager with all of their information

WHEN I choose to view all employees by role

THEN I am prompted to select a role and a table listing all employees that are in the selected role with all of their information

WHEN I choose to add an employee

THEN I am prompted to input the name, role, and manager of the new employee

WHEN I choose to add a department

THEN I am prompted to type the name of the new department

WHEN I choose to remove an employee

THEN I am prompted to select the name of the employee to be removed

WHEN I choose to add a role

THEN I am prompted to type the name of the new role

WHEN I choose to remove a role

THEN I am prompted to select the name of the role to be removed

WHEN I choose to remove a deparatment

THEN I am prompted to select the name of the department to be removed

WHEN I choose to update an employee role

THEN I am prompted to select the name of an employee and then select the name of their new role 

WHEN I choose to update an employee manager

THEN I am prompted to select the name of an employee and then select the name of their new role

WHEN I choose to view a department's overhead

THEN I am prompted to selet the name of a department and the sum of the salaries of all employees in the selected department is displayed

WHEN I indicate that I am done

THEN the connection is terminated and I go back to the command-line prompt

## Images

Fig. 1: 
![](/Develop/NodeChoice.PNG)

## Install

You need to install inquirer and mysql in order to allow prompts and interaction with the database, respectively.

## Contributions

If you have any contribution ideas or thoughts, please contact me via email (chris.kabana@gmail.com)

## Testing

When you are using this app, test it using Node in the command line (I used Git Bash)

## Questions

If you have any questions that are not answered, please feel free to reach out to me at my email (chris.kabana@gmail.com)

You can also reach out to me on GitHub by searching for my username: dktrcoco

Or following the link: https://github.com/dktrcoco
