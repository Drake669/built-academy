"use client";

import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";

import { ChapterDeleteModal } from "./ChapterDeleteModal";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
  isPublished: boolean;
  chapterId: string;
  isComplete: boolean;
  courseId: string;
}

const ChapterActions = ({
  isPublished,
  chapterId,
  isComplete,
  courseId,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState<"" | "delete" | "publish">("");
  const handleDelete = async () => {
    try {
      setLoading("delete");
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter has been deleted successfully");
      router.push(`/teacher/courses/${courseId}/`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chapter from course");
    } finally {
      setLoading("");
    }
  };
  const handlePublish = async () => {
    try {
      setLoading("publish");
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/publish`,
        {
          isPublished: true,
        }
      );
      toast.success("Chapter has been published");
      router.refresh();
    } catch (error) {
      toast.error("Failed to publish this chapter");
    } finally {
      setLoading("");
    }
  };
  const handleUnpublish = async () => {
    try {
      setLoading("publish");
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/unpublish`,
        {
          isPublished: false,
        }
      );
      toast.success("Chapter has been unpublished");
      router.refresh();
    } catch (error) {
      toast.error("Failed to unpublish this chapter");
    } finally {
      setLoading("");
    }
  };
  return (
    <div className="flex items-center">
      <Button
        variant={"ghost"}
        onClick={isPublished ? handleUnpublish : handlePublish}
        disabled={!isComplete || loading === "publish"}
      >
        {loading === "publish" && (
          <Loader2 className="w-4 h-4 animate-spin transition mr-1" />
        )}
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ChapterDeleteModal onConfirm={handleDelete}>
        <Button variant={"destructive"} disabled={loading === "delete"}>
          {loading === "delete" ? (
            <Loader2 className="w-4 h-4 text-white animate-spin transition" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
        </Button>
      </ChapterDeleteModal>
    </div>
  );
};

export default ChapterActions;
