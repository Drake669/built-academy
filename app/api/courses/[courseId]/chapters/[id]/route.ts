import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import Mux from "@mux/mux-node"

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
...values
}})
const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);

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