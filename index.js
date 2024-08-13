#! \usr\bin\env node
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
//Title Description
console.log(chalk.bold.magentaBright("\n \t\t OOP_MY_BANK_Application"));
console.log("*".repeat(60));
console.log(chalk.bold.yellowBright('\n\t Welcome to typescript OOP-MY-BANK Application'));
console.log(">".repeat(70));
//customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mobNum, accNum) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mobNum;
        this.accNumber = accNum;
    }
}
//bank account class
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let NewAccounts = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...NewAccounts, accObj];
    }
}
let UBL = new Bank();
//function to add a new customer
for (let i = 1; i <= 5; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.string.numeric(10)); // Adjust the length as needed
    const cust = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    UBL.addCustomer(cust);
    UBL.addAccountNumber({ accNumber: cust.accNumber, balance: 10000 * i });
}
//Bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "service",
            message: "Choose your banking service:",
            choices: ["Check balance", "Deposit money", "Withdraw money", "Exit"],
        });
        // check balance
        if (service.service == "Check balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your Account Number:",
            });
            let account = UBL.account.find((acc) => acc.accNumber == parseInt(res.number));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let name = UBL.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} Your current balance is: ${chalk.bold.yellowBright(`$${account.balance}`)}`);
            }
        }
        // Deposit money
        if (service.service == "Deposit money") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your Account Number:",
            });
            let account = UBL.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "amount",
                    message: "Enter the amount to deposit:",
                });
                let newBalance = account.balance + ans.amount;
                //transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                //total amount
                console.log(`Dear ${chalk.green.italic(UBL.customer.find((item) => item.accNumber == account?.accNumber)
                    ?.firstName)} ${chalk.green.italic(UBL.customer.find((item) => item.accNumber == account?.accNumber)
                    ?.lastName)} Your new balance is: ${chalk.bold.yellowBright(`$${newBalance}`)}`);
            }
        }
        // Withdraw money
        if (service.service == "Withdraw money") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your Account Number:",
            });
            let account = UBL.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "amount",
                    message: "Enter the amount to withdraw:",
                });
                if (ans.amount > account.balance) {
                    console.log(chalk.red.bold("Insufficient balance!"));
                }
                let newBalance = account.balance - ans.amount;
                //transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                //remaining amount
                console.log(`Dear ${chalk.green.italic(UBL.customer.find((item) => item.accNumber == account?.accNumber)
                    ?.firstName)} ${chalk.green.italic(UBL.customer.find((item) => item.accNumber == account?.accNumber)
                    ?.lastName)} Your remaining balance is: ${chalk.bold.yellowBright(`$${newBalance}`)}`);
            }
        }
        // Exit the program
        if (service.service == "Exit") {
            console.log("Thanking you for using this application...");
            process.exit(0);
        }
    } while (true);
}
bankService(UBL);
