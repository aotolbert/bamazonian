const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");

const divider = "\n$-----------------------------------------------$\n"

let incorrect = 0;


const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "products_db"
})

connection.connect(function(err) {
    if (err) throw(err);
    console.log("Connected as id " + connection.threadId);
    authenticator();
});



var authenticator = function() {


    inquirer.prompt({
        type: "input",
        name: "password",
        message: "Please enter the password"
    }).then(function(pass) {
        if (pass.password === "password") {
            manage_bamazon();
            incorrect = 0;

        } else {
            console.log("Whoops! Try again");
            incorrect++;
            authenticator();
        }
    });


};


function manage_bamazon() {

    inquirer.prompt({
        type: "list",
        name: "function",
        message: "What would you like to do?",
        choices: ["View Marketplace", "View Inventory Alarms", "Add New Item To Marketplace", "Update Quantity of Existing Product"]
    }).then(function(action) {
        switch (action.function) {

            case "View Marketplace":
            return viewMarket();

            case "View Inventory Alarms":
            return viewAlarms();

            case "Add New Item To Marketplace":
            return addItem();

            case "Update Quantity of Existing Product":
            return updateQuantity();
        }


    });

};


function viewMarket() {

    var query = connection.query(
        "SELECT * FROM auction_block", function(err, data) {
            if (err) throw (err);
            for (i=0; i<data.length; i++) {
                    if (data[i].quantity > 25) {
                        console.log(`${divider}${data[i].id}: ${chalk.bgRed(`  ${data[i].department}  `)}  ${data[i].item} ${chalk.green(`$${data[i].price}`)} ${chalk.bgCyan(chalk.black(`  QUANTITY: ${data[i].quantity}  `))} ${divider}`)
                    } else {
                        console.log(`${divider}${data[i].id}: ${chalk.bgRed(`  ${data[i].department}  `)}  ${data[i].item} ${chalk.green(`$${data[i].price}`)} ${chalk.bgRed(chalk.bold(`  QUANTITY: ${data[i].quantity}  `))} ${divider}`)

                    }
                } 

            manage_bamazon();            
        }

    )


};

function viewMarketClean() {

    var query = connection.query(
        "SELECT * FROM auction_block", function(err, data) {
            if (err) throw (err);
            for (i=0; i<data.length; i++) {
                    if (data[i].quantity > 25) {
                        console.log(`${divider}${data[i].id}: ${chalk.bgRed(`  ${data[i].department}  `)}  ${data[i].item} ${chalk.green(`$${data[i].price}`)} ${chalk.bgCyan(chalk.black(`  QUANTITY: ${data[i].quantity}  `))} ${divider}`)
                    } else {
                        console.log(`${divider}${data[i].id}: ${chalk.bgRed(`  ${data[i].department}  `)}  ${data[i].item} ${chalk.green(`$${data[i].price}`)} ${chalk.bgRed(chalk.bold(`  QUANTITY: ${data[i].quantity}  `))} ${divider}`)

                    }
                } 

        }

    )


};


function viewAlarms() {

    var query = connection.query(
        "SELECT * FROM auction_block WHERE quantity <= ?", 
        25,
        function(err, data) {
            if (err) throw (err);
            for (i=0; i<data.length; i++) {
                console.log(`${divider}${data[i].id}: ${chalk.bgRed(`  ${data[i].department}  `)}  ${data[i].item} ${chalk.green(`$${data[i].price}`)} ${chalk.bgRed(chalk.bold(`  QUANTITY: ${data[i].quantity}  `))} ${divider}`)
                } 

            manage_bamazon();            
        }

    )

};

function addItem() {

    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "What are you adding?"
        },
        {
            type: "input",
            name: "dept",
            message: "What department does it belong to?"
        },
        {
            type: "input",
            name: "desc",
            message: "Can you write a brief description of this item?"
        },
        {
            type: "number",
            name: "price",
            message: "How much are you charging for it?"
        },
        {
            type: "number",
            name: "quantity",
            message: "How many are you adding?"
        },
    ]).then(function(newitem) {



            let sql = `INSERT INTO auction_block (item, department, description, price, quantity)
                        VALUES (
                        "${newitem.item}", 
                        "${newitem.dept}",
                        "${newitem.desc}", 
                        ${newitem.price}, 
                        ${newitem.quantity})`;

            let nomad = [false, 1];

            connection.query(sql, nomad, (error, results, fields) => {
            if (error){
                return console.error(error.message);
            }
            console.log(`${divider + chalk.green("\nAddition Successful!\n") + divider}`)


            manage_bamazon();

            });

    });



};


function updateQuantity() {

    inquirer.prompt([
        {
        type: "number",
        name: "id",
        message: "Enter the id of the item you would like to update",
        },
        {
        type: "number",
        name: "quantity",
        message: "Enter the new quantity for this item",
        }
        ])
        .then(function(item) {
        let sql = `UPDATE auction_block
        SET quantity = ${item.quantity}
        WHERE id = ${item.id}`;

        let nomad = [false, 1];

        connection.query(sql, nomad, (error, results, fields) => {
        if (error){
            return console.error(error.message);
        }

        console.log(`${divider + chalk.green("\nUpdate Successful!!\n") + divider}`)

        manage_bamazon();

        });
    });


};