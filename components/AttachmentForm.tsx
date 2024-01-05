"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Delete,
  DeleteIcon,
  File,
  Loader2,
  PlusIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "./FileUpload";

const formSchema = z.object({
  url: z.string().min(1),
});

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
}

const AttachmentForm = ({ initialData }: AttachmentFormProps) => {
  const router = useRouter();

  const [isEditting, setIsEditting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${initialData.id}/attachments`,
        values
      );
      toggleEditing();
      router.refresh();
      toast.success("Course has been updated successfully");
    } catch (error) {
      toast.error("Course update failed");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(
        `/api/courses/${initialData.id}/attachments/${id}`
      );
      router.refresh();
      toast.success("Attachment removed from course");
    } catch (error) {
      toast.error("Failed to remove attachment");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleEditing = () => {
    setIsEditting(!isEditting);
  };
  return (
    <div className=" mt-5 bg-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between font-medium">
        Course Attachments
        <Button
          variant={"ghost"}
          onClick={() => {
            toggleEditing();
          }}
        >
          {isEditting ? (
            <>Cancel</>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add file
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <>
            {initialData.attachments.length === 0 && (
              <p className=" text-sm text-slate-500 italic">
                No attachments yet
              </p>
            )}
            {initialData.attachments.length > 0 && (
              <div className=" space-y-2">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className=" rounded-md bg-sky-100 text-sky-700 flex justify-between p-3 items-center"
                  >
                    <div className="flex items-center">
                      <File className="h-4 w-4 text-sky-700 mr-2" />
                      <p className="text-sm line-clamp-1">{attachment.name}</p>
                    </div>
                    <div>
                      {deletingId === attachment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <button
                          className="ml-auto hover:opacity-75 transition"
                          onClick={() => {
                            handleDelete(attachment.id);
                          }}
                        >
                          <Trash className="w-4 h-4 text-rose-700" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url: url });
                }
              }}
            />
            <div className="text-sm text-muted-foreground mt-2">
              Add anything students might need
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentForm;
