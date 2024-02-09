const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const APIResponse = require('../models/apiResponse');
const dynamodb = require('../dynamoDB');

var response = new APIResponse(false,"",null);

router.post('/createusers', async (req, res) => {
    var status = 200;
    try {
        const {firstname, lastname, username, email, password, image, sex} = req.body;

        const currentYear = new Date().getFullYear();

         const paramsEmail = {
            TableName: 'user_table',
            FilterExpression: '#email = :emailValue',
            ExpressionAttributeNames: {
                '#email': 'email' 
            },
            ExpressionAttributeValues: {
                ':emailValue': email 
            }
        };

        const paramsUser = {
            TableName: 'user_table',
            FilterExpression: '#username = :usernameValue',
            ExpressionAttributeNames: {
                '#username': 'username' 
            },
            ExpressionAttributeValues: {
                ':usernameValue': username 
            }
        };
        var getUser = await dynamodb.scan(paramsUser).promise();
        var getEmail = await dynamodb.scan(paramsEmail).promise();

        console.log(getUser);
        console.log(getEmail);
        
        if (getUser.Count != 0) {
            status = 404;
            response.success = false;
            response.message = 'This username has already been used.';
        } else if (getEmail.Count != 0) {
            status = 404;
            response.success = false;
            response.message = 'This email has already been used.';
        } else{
             const newUsercode = await generateUserCode(currentYear);
             const newUser = new User(newUsercode, firstname, lastname, null, username, email, password, image, sex, null, null, null, null, null);
             const params = {
                TableName: 'user_table',
                Item: newUser.toDbObject()
            };
            await dynamodb.put(params).promise();
            status = 200;
            response.success = true;
            response.message = 'User created successfully.';
        }
        res.status(status).json(response.toDbObject());
    } catch (error) {
        status = 500;
        console.error("Error creating user:", error);
        response.success = false;
        response.message = 'Error creating user.';
        res.status(status).json(response.toDbObject());
    }
});

router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
});

async function generateUserCode(year) {
    var params = {  TableName: 'user_table' };
    let usercode = "RM" + year.toString().substr(-2) + "0000";
    var data = await dynamodb.scan(params).promise();
     if(data.Count != 0){
        usercode = data.Items[data.Count-1].usercode;
        var x = usercode.substring(4,8);
        var number = (+x)+1;
        if (number.toString().split('').length == 4) {
            usercode = `${usercode.substring(0,4)}${(+x)+1}`;
        } else if (number.toString().split('').length == 3) {
            usercode = `${usercode.substring(0,4)}0${(+x)+1}`;
        } else if (number.toString().split('').length == 2) {
            usercode = `${usercode.substring(0,4)}00${(+x)+1}`;
        } else if (number == 9999){
            usercode = `${usercode.substring(0,4)}0001`;
        } else {
            usercode = `${usercode.substring(0,4)}000${(+x)+1}`;
        }
    }
    return usercode;
}

module.exports = router;