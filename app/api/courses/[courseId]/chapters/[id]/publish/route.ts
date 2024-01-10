import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: {courseId: string, id: string}}) {
    try {
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", {status: 401})
        const courseOwner = await db.course.findUnique({
    where: {
        id: params.courseId,
        userId,
    }})
    if(!courseOwner) return new NextResponse("Unauthorized", {status: 401})

    const chapter = await db.chapters.findUnique({
        where: {
            id: params.id,
            courseId: params.courseId
        }
    })

    const existingMuxData = await db.chapters.findUnique({
        where: {
            id: params.id,
            courseId: params.courseId
        }
    })

    if(!existingMuxData || !chapter?.description || !chapter?.title || !chapter.videoUrl){
        return new NextResponse("Missing some fields", {status: 400})
    }

    const updatedChapter = await db.chapters.update({
        where: {
            id: params.id,
            courseId: params.courseId
        },
        data: {
            isPublished: true
        }
    })
    return NextResponse.json(updatedChapter)
    } catch (error) {
        console.log("CHAPTER_UPATE ERROR")
        return new NextResponse("Server Error", {status: 500})
    }
}