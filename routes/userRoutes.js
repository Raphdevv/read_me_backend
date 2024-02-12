const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const APIResponse = require('../models/apiResponse');
const { LoginModel, LoginResponseModel } = require('../models/loginModel'); 
const dynamodb = require('../aws/dynamoDB');
const { verifyToken, generateToken } = require('../middleware/auth');
const { encryptPassword, comparePassword } = require('../middleware/passwordcode');
const moment = require('moment-timezone');

var response = new APIResponse(false,"",null);
const thaiTime = moment.tz('Asia/Bangkok');

router.post('/createusers', async (req, res) => {
    var status = 200;
    try {
        const {firstname, lastname, username, email, password, image, sex} = req.body;

        const currentYear = new Date().getFullYear();
        const currentDate = thaiTime.format('DD-MM-YYYY HH:mm:ss');

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
        
        if (getUser.Count != 0) {
            status = 404;
            response.success = false;
            response.message = 'This username has already been used.';
        } else if (getEmail.Count != 0) {
            status = 404;
            response.success = false;
            response.message = 'This email has already been used.';
        } else{
            var encrypt = await encryptPassword(username);
            const newUsercode = await generateUserCode(currentYear);
            const newUser = new User(newUsercode, firstname, lastname, null, username, email, encrypt, image, sex, null, null, null, null, null,currentDate,currentDate);
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

router.post('/login', async (req, res) => {
    var status = 200;
    try {
        const {email, password} = req.body;

        const currentDate = thaiTime.format('DD-MM-YYYY HH:mm:ss');

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

        var getEmail = await dynamodb.scan(paramsEmail).promise();
        if(getEmail.Items.Count != 0) {
            var isDecrypt = await comparePassword(password,getEmail.Items[0].password);
            if(!isDecrypt) {
                const exp = Math.floor(Date.now() / 1000) + 129600;
                const iat = Math.floor(Date.now() / 1000);
                var token = await generateToken(getEmail.Items[0].username, exp, iat);
                var responseUser = new LoginResponseModel(
                    getEmail.Items[0].usercode,
                    getEmail.Items[0].firstname,
                    getEmail.Items[0].lastname,
                    getEmail.Items[0].username,
                    getEmail.Items[0].email,
                    getEmail.Items[0].image,
                    getEmail.Items[0].sex,
                    token,
                );
                var login = new LoginModel(getEmail.Items[0].usercode, token, currentDate, currentDate);
                const paramsLogin = {
                    TableName: "userlogin_table",
                    Item: login.toDbObject()
                }
                await dynamodb.put(paramsLogin).promise();
                status = 200;
                response.success = true;
                response.message = "susccess";
                response.data = responseUser.toDbObject();
            } else {
                status = 404;
                response.success = false;
                response.message = "Password is incorrect.";
            }
        } else {
            status = 404;
            response.success = false;
            response.message = "Email not found.";
        }

        res.status(status).json(response.toDbObject());
    } catch (error) {
        status = 500;
        response.success = false;
        response.message = error.message;
        res.status(status).json(response.toDbObject());
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