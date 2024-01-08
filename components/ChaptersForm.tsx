"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Chapters, Course } from "@prisma/client";
import { Input } from "./ui/input";
import ChaptersList from "./ChaptersList";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapters[] };
}

const ChaptersForm = ({ initialData }: ChaptersFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reset, setReset] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${initialData.id}/chapters`,
        values
      );
      toggleCreating();
      router.refresh();
      form.reset();
      toast.success("Chapter has been created");
    } catch (error) {
      toast.error("Chapter creation failed");
    }
  };

  const onReorder = async (
    updatedCourses: {
      id: string;
      position: number;
    }[]
  ) => {
    try {
      setIsUpdating(true);
      const reponse = await axios.put(
        `/api/courses/${initialData.id}/chapters/reorder`,
        {
          list: updatedCourses,
        }
      );
      setReset(false);
      toast.success("Chapters have been reordered succesfully");
      router.refresh();
    } catch (error) {
      setReset(true);
      toast.error("Unable to reorder chapters, please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };
  return (
    <div className="relative mt-5 bg-slate-100 rounded-lg p-5">
      {isUpdating && (
        <div className="absolute h-full w-full flex justify-center items-center bg-slate-500/20 top-0 right-0 rounded-md">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course Chapters
        <Button
          variant={"ghost"}
          onClick={() => {
            toggleCreating();
          }}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {isCreating && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g 'Introduction to course...'"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        )}
        {!isCreating && initialData.chapters.length === 0 && (
          <p className=" italic text-sm text-slate-500">No Chapters</p>
        )}
        {!isCreating && initialData.chapters.length > 0 && (
          <ChaptersList
            onEdit={(id) => {
              router.push(`/teacher/courses/${initialData.id}/chapters/${id}`);
            }}
            onReorder={onReorder}
            chapters={initialData.chapters || []}
            reset={reset}
            setReset={setReset}
          />
        )}
        {!isCreating && (
          <p className="text-sm text-slate-500 mt-5">
            Drag and drop to re-arrange chapters
          </p>
        )}
      </div>
    </div>
  );
};

export default ChaptersForm;
