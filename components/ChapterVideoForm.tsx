"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import MuxPlayer from "@mux/mux-player-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Pencil, PlusIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Chapters, MuxData } from "@prisma/client";
import { FileUpload } from "./FileUpload";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
  initialData: Chapters & { muxData?: MuxData | null };
  courseId: string;
}

const ChapterVideoForm = ({ initialData, courseId }: ChapterVideoFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });

  const [isEditting, setIsEditting] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${initialData.id}`,
        values
      );
      toggleEditing();
      router.refresh();
      toast.success("Chapter has been updated successfully");
    } catch (error) {
      toast.error("Chapter update failed");
    }
  };

  const toggleEditing = () => {
    setIsEditting(!isEditting);
  };
  return (
    <div className=" mt-5 bg-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <Button
          variant={"ghost"}
          onClick={() => {
            toggleEditing();
          }}
        >
          {isEditting ? (
            <>Cancel</>
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add video
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <div>
            {initialData.videoUrl ? (
              <div className="relative aspect-video mt-2">
                <MuxPlayer
                  playbackId={initialData?.muxData?.playbackId || ""}
                />
              </div>
            ) : (
              <div className="bg-slate-100 flex items-center justify-center h-60 rounded-md">
                <VideoIcon className="text-slate-500 h-10 w-10" />
              </div>
            )}
          </div>
        ) : (
          <div>
            <FileUpload
              endpoint="chapterVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videoUrl: url });
                }
              }}
            />
          </div>
        )}
      </div>
      {initialData.videoUrl && !isEditting && (
        <div className=" text-xs text-muted-foreground mt-2">
          Videos can take some minutes to process, please refresh the page if it
          takes a long time
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
