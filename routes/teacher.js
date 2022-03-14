var express = require('express');
//const { authenticateToken } = require('../middleware');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

/* GET teacher. */
router
    .route('/')
    .get((req, res) => {
        prisma.teacher.findMany()
            .then((data) => {
                res.send({ data: data, method: req.method });
            })
    });
/* Get teacher by email */
router
    .route('/by-email')
    .get((req, res) => {
        var email = req.query.email;
        prisma.teacher.findMany({
            where: { email: email }
        })
        .then((data) => {
            res.send({ data: data, method: req.method });
        });
    });
/* GET teacher by id. */
router
    .route('/:id')
    .get((req, res) => {
        var id = +req.params.id;
        prisma.teacher.findMany({
                where: { id: id }
            })
            .then((data) => {
                res.send({ data: data, method: req.method });
            });
    });
/* Create new teacher */
router
    .route('/')
    .post((req, res) => {
        var user = {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            email: req.body.email,
            address: req.body.address,
            gender: req.body.gender,
            avatar: req.body.avatar,
            birthdate: req.body.birthdate,
        }
        prisma.teacher.create({
            data: {
                lastName: user.lastname,
                firstName: user.firstname,
                middleName: user.middlename,
                email: user.email,
                address: user.address,
                gender: user.gender,
                avatar: user.avatar,
                birthdate: user.birthdate
            }
        }).then((ret) => {
            res.send({ payload: { success: true, method: req.method }})
        });
    });
/* Register new teacher */
router
    .route('/register')
    .post((req, res) => {
        var email = req.body.email;
        prisma.teacher.create({
            data: {
                email: email
            }
        }).then((ret) => {
            res.send({ payload: { success: true, method: req.method }})
        });
    });
module.exports = router;