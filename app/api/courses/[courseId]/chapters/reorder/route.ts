import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PUT(req: Request, {params}: {params : {courseId: string}}) {
    try {
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthorized", {status: 401})
        const courseOwner = await db.course.findUnique({
    where: {
        id: params.courseId,
        userId
    }
})
if(!courseOwner) return new NextResponse("Unauthorized", {status: 401})
const { list } = await req.json()
for(let item of list){
    await db.chapters.update({
        where: {
            id: item.id
        },
        data: {
            postion: item.position
        }
    })
    return new NextResponse("Chapters reordered succesfully", {status: 200})
}
    } catch (error) {
        console.log("COURSE_REORDER", error)
        return new NextResponse("Server Error", {status: 500})
    }
}