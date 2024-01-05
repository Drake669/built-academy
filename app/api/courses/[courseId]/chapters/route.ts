import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, {
    params
}: {params: {courseId: string}}) {
    try {
        const { userId } = auth()
        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        const { title } = await req.json()

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if(!courseOwner) return new NextResponse("You are not the owner of the course", {status: 400})

        const lastChapter = await db.chapters.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy:{
                postion: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.postion + 1 : 1

        const chapter = await db.chapters.create({
            data: {
                title,
                courseId: params.courseId,
                postion: newPosition,
            }
        })
        return NextResponse.json(chapter)
    } catch (error) {
        console.log("COURSE_CHAPTER", error)
        return new NextResponse("Server Error", {status: 500})
    }
}