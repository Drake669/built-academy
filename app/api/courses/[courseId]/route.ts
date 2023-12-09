import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params} : {params: {courseId: string}}){
    try {
        const { userId} = auth()
        if(!userId) return new NextResponse("Unauthorized", {status: 401})
        const values = await req.json()
        const updatedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                ...values
            }
            
        })
        if(!updatedCourse) return new NextResponse("Course cannot be found", {status: 400})
        return NextResponse.json(updatedCourse, {status: 200 })
    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500})
    }
}