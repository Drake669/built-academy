import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import Mux from "@mux/mux-node"

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);


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
    const {isPublished,...values} = await req.json()
    const updatedChapter = await db.chapters.update({
where: {
    id: params.id
},data: {
...values,
}})

if(values.videoUrl){
    const existingMuxData = await db.muxData.findFirst({
        where: {
            chapterId: params.id,
        }
    })
    if(existingMuxData){
        await Video.Assets.del(existingMuxData.assetId)
        await db.muxData.delete({
            where: {
                id: existingMuxData.id
            }
        })
    }

    const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false
    })

    await db.muxData.create({
        data: {
            chapterId: params.id,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0].id
        }
    })
}

return NextResponse.json(updatedChapter)
    } catch (error) {
        console.log("CHAPTER_UPATE ERROR")
        return new NextResponse("Server Error", {status: 500})
    }
}

export async function DELETE(req: Request, {params}: {params: {courseId: string, id: string}}) {
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
    if(!chapter) return new NextResponse("Not Found", {status: 401})

    if(chapter.videoUrl){
       const existingMuxData =  await db.muxData.findFirst({
            where: {
                chapterId: params.id
            }
        })
        if(existingMuxData){
            await Video.Assets.del(existingMuxData.assetId)
            await db.muxData.delete({
                where: {
                    id: existingMuxData.id
                }
            })
        }  
    }

    await db.chapters.delete({
        where: {
            id: params.id,
            courseId: params.courseId
        }
    })

    const publishedChapters = await db.chapters.findMany({
        where: {
            courseId: params.courseId,
            isPublished: true
        }
    })
    if(!publishedChapters.length){
        await db.course.update({
            where: {
                id: params.courseId
            },
            data:{
                isPublished: false
            }
        })
    }
    return new NextResponse("Chapter deleted successfully", {status: 200})
    } catch (error) {
        console.log("CHAPTER_DELETE ERROR")
        return new NextResponse("Server Error", {status: 500})
    }
}
