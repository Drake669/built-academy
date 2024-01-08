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
    const values = await req.json()
    const updatedChapter = await db.chapters.update({
where: {
    id: params.id
},data: {
...values
}})
return NextResponse.json(updatedChapter)
    } catch (error) {
        console.log("CHAPTER_UPATE ERROR")
        return new NextResponse("Server Error", {status: 500})
    }
}