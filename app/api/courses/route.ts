import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {

        const { userId } =  auth()
        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        const { title } = await req.json()
        const course = await db.course.create({
            data: {
                title,
                userId
            }
        })
        return NextResponse.json(course, {status: 200} )
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal server Error", {status: 500})
    }
}