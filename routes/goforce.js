var express = require('express');
const { authenticateToken } = require('../middleware');
var router = express.Router();
var PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

/* GET all games. */
router.get('/games', authenticateToken, function (req, res, next) {
    prisma.game.findMany({
        include: {
            vote: true
        }
    }).then((data) => {
        res.send({ data: data, method: req.method });
    });
});

/* GET user by uid */
router.get('/user', authenticateToken, async function (req, res, next) {
    try {
        var uid = req.query.uid;
        // var user = await prisma.user.findMany({
        //     where: {
        //         email: {
        //             equals: email
        //         }
        //     }
        // });
        var user = await prisma.user.findUnique({
            where: {
                uid: uid
            },
            include: {
                vote: true
            }
        });
        res.status(201).send({ data: user });
    } catch (err) {
        res.status(500).send({ error: { message: err } });
    } finally {
        async () => {
            await prisma.$disconnect();
        }
    }
});

/* Register User */
router.post('/register', authenticateToken, function (req, res, next) {
    var email = req.body.email;
    var uid = req.body.uid
    prisma.user.create({
        data: {
            email: email,
            uid: uid
        }
    })
        .then(() => {
            res.send({ payload: { success: true, method: req.method } })
        });
});

/* Update user profile */
router.post('/update-profile', authenticateToken, function (req, res, next) {
    var user = {
        uid: req.body.uid,
        email: req.body.email,
        name: req.body.name,
        remarks: req.body.remarks,
        games: req.body.games,
        platform: req.body.platform
    }
    prisma.user.update({
        where: {
            uid: user.uid
        },
        data: {
            email: user.email,
            name: user.name,
            remarks: user.remarks,
            games: user.games,
            platform: user.platform
        }
    })
        .then((data) => {
            res.status(200, { data: data.name, success: true, message: 'User successfully created.' })
        });
});

/* Cast vote */
router.post('/vote', authenticateToken, function (req, res, next) {
    var vote = {
        userId: req.body.userId,
        gameId: req.body.gameId,
        voteCasted: req.body.voteCasted,
        quarter: 1
    }
    prisma.vote.create({
        data: {
            userId: vote.userId,
            gameId: vote.gameId,
            voteCasted: vote.voteCasted,
            quarter: vote.quarter
        }
    })
        .then(() => {
            res.send({ payload: { success: true, method: req.method } })
        });
});

/*Get game by order of release and put number stamp on it*/
router.get('/get-games-by-release', authenticateToken, function (req, res, next) {
    const includes = {
        vote: {
            include: {
                user: true
            }
        }
    }
    prisma.game.findMany({
        where: {
            voteShow: false
        },
        include: includes,
        orderBy: {
            releaseDate: "asc"
        }
    }).then((data) => {
        var arr = []
        for (let index = 0; index < data.length; index++) {
            const element = { ...data[index], no: index };
            arr.push(element)
        }
        res.status(201).send(arr)
    });
});

/*Set voteshow to true */
router.post('/set-vote-show', authenticateToken, function (req, res, next) {
    const voteShow = req.body.voteShow;
    const id = req.body.id;
    prisma.game.update({
        where: {
            id: id
        },
        data: {
            voteShow: voteShow
        }
    }).then((data) => {
        res.status(201).send({ success: true, method: req.method });
    })
});

/*Make account become player*/
router.post('/set-as-player', authenticateToken, function (req, res, next) {
    const uid = req.body.uid;
    prisma.user.update({
        where: {
            uid: uid
        },
        data: {
            role: 'PLAYER'
        }
    }).then((data) => {
        res.status(201).send({ success: true, method: req.method });
    });
});

//endpoints need to create
//get all games
//get games voted by players
//get all contestant
//  player 1-n
//  player audience

module.exports = router;