const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient()

async function main (){
    try {
        await database.category.createMany({
            data: [
                {
                    name: "Accouting"
                },
                {
                    name: "Engineering"
                },
                {
                    name: "Finance"
                }
            ]
        })
        console.log("Seeding successful")
    } catch (error) {
        console.log("Error seeding categories", error)
    }finally{
        database.$disconnect()
    }
}

main()