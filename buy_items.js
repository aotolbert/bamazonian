const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");

const divider = "\n$-----------------------------------------------$\n"

let connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "products_db"
})

connection.connect(function(err) {
    if (err) throw(err);
    console.log("Connected as id " + connection.threadId);
    itemLookup();

});


function itemLookup() {
    console.log("Thanks for visiting bamazon!! Here are all the things that we have for sale!!")
    var query = connection.query(
        "SELECT * FROM auction_block", function(err, data) {
            if (err) throw (err);
            for (i=0; i<data.length; i++) {
            console.log(`${data[i].id}: ${data[i].item} ${data[i].description}  ${chalk.green(`$${data[i].price}`)}${divider}`)
            } 

            buyItem();
            
        }

    )

};
    


function buyItem() {
        
        inquirer.prompt({
            type: "number",
            name: "id",
            message: "Enter the id of the item you would like to buy!",

        }).then(function (buyerchoice) {

            const itemid = buyerchoice.id

            var query = connection.query(
                "SELECT * FROM auction_block WHERE ?",
                {
                    id: itemid
                },
                function(err, data) {
                    if (err) throw(err);
                    console.log(`${divider}${data[0].item} ${chalk.green(`$${data[0].price}`)} Remaining:${chalk.bgRed(`${data[0].quantity}`)} ${divider}`)
                    inquirer.prompt({
                        type: "number",
                        name: "purchasesize",
                        message: (`Looks like we have ${data[0].quantity} Of those left, how many would you like to buy?`)

                    }).then(function(userinput) {
                        if (data[0].quantity >= userinput.purchasesize) {
                            console.log(`\n\nOK! So you're buying ${userinput.purchasesize} ${data[0].item}s. That'll be $${data[0].price * userinput.purchasesize}`)

                            updateQuantity(data[0].quantity, userinput.purchasesize, itemid);
                
                        } else {
                            console.log(`Sorry we don't have enough of those. Try buying something else!`);
                            itemLookup();
                        };
                        
                        
                        });
                
                        
                }
            )
        
        })
        
        
                    // connection.end();

    };


    function updateQuantity(qtyo, qtyn, id) {
        let newquantity = (qtyo - qtyn)

        let sql = `UPDATE auction_block
                    SET quantity = ${newquantity}
                    WHERE id = ${id}`;
            
            let nomad = [false, 1];
            
            connection.query(sql, nomad, (error, results, fields) => {
            if (error){
                return console.error(error.message);
            }
            console.log('PURCHASE SUCCESSFUL!')
            
                        inquirer.prompt({
                            type: "confirm",
                            name: "newpurchase",
                            message: "Would you like to make another purchase??"

                        }).then(function(confirm) {
                            if (confirm.newpurchase) {
                                itemLookup();
                            } else {
                                connection.end();
                            }
                        });
                    
            });



                //     inquirer.prompt({
                //     type: "confirm",
                //     name: "newpurchase",
                //     message: "Would you like to make another purchase??"

                // }).then(function(confirm) {
                //     if (confirm) {
                //         itemLookup();
                //     } else {
                //         connection.end();
                //     }
                // });
            

        
    };

