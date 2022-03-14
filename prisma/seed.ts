import { PrismaClient } from '@prisma/client'
import { games } from './games'
import { users } from './users'

const prisma = new PrismaClient();

async function main() {
    for (let game of games) {
        await prisma.game.create({
            data: game
        })
    }
    for (let user of users) {
        await prisma.authenticationUser.create({
            data: {
                username: user.username,
                password: user.password,
                role: user.role
            }
        })
    }
}

main().catch(e => {
    console.log(e);
}).finally(() => {
    prisma.$disconnect();
})