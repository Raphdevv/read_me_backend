const express = require('express');
const router = express.Router();
const dynamodb = require('../dynamoDB');

router.post('/users', async (req, res) => {
    try {
        const { usercode, id, firstname, lastname, idCard, username, email, password, image, sex, cartcode, favcode, writingcode, followercode, followingcode } = req.body;

        const newUser = new User(usercode, id, firstname, lastname, idCard, username, email, password, image, sex, cartcode, favcode, writingcode, followercode, followingcode);

        const params = {
            TableName: 'user_table',
            Item: newUser.toDbObject() 
        };
        await dynamodb.put(params).promise();
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
});

module.exports = router;