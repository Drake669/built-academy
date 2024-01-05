import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, {
    params
}: {params: {courseId: string,attachmentId: string}}) {
    try {
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", {status: 401})
        const courseOwner = await db.course.findUnique({
    where: {
        id: params.courseId,
        userId
    }})
    if (!courseOwner) return new NextResponse("You are not the owner of the course", {status: 400})
      const attachment =  await db.attachment.delete({
    where: {
        courseId: params.courseId,
        id: params.attachmentId
    }})    
    return NextResponse.json(attachment)
    } catch (error) {
        console.log("ATTACHMENT_DELETE", error)
        return new NextResponse("Server Error", {status: 500})
    }
}