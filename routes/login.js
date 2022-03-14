var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
var router = express.Router();
const SALT = process.env.SALT;

const prisma = new PrismaClient();

/* REGISTER USER */
router.post('/register', async function(req, res) {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, +SALT);
        var newUser = await prisma.authenticationUser.create({
            data: {
                username: req.body.username,
                password: hashedPass
            }
        });
        var message = {
            username: newUser.username,
            message: "User successfully created."
        }
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send({ error: { message: err } });
    } finally {
        async() => {
            await prisma.$disconnect();
        }
    }
});

/* CREATE TOKEN FOR USER */
router
    .route('/token')
    .post(async function(req, res) {
        try {
            var pass = req.body.password;
            var username = req.body.username;
            var filteredUser = await prisma.authenticationUser.findFirst({
                where: {
                    username: {
                        equals: username
                    }
                }
            });
            if (filteredUser == null) {
                return res.status(400).send({ error: { message: 'User not found' } });
            }
            var resCompare = await bcrypt.compare(pass, filteredUser.password);
            if (!resCompare) {
                res.status(401).send({ error: { message: "Unauthorize User" } });
            }
            const accessToken = jwt.sign(filteredUser.username, process.env.ACCESS_TOKEN_SECRET);
            res.status(201).send({ success: true, data: { username: filteredUser.username, access_token: accessToken } });
        } catch (err) {
            res.status(500).send({ error: { message: err } });
        } finally {
            async() => {
                await prisma.$disconnect();
            }
        }
    });

module.exports = router;