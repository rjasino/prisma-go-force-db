var express = require('express');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

/* GET all student. */
router.get('/', function(req, res, next) {
  prisma.student.findMany()
    .then((data) => {
        res.send({ data: data, method: req.method });
    });
});

module.exports = router;
