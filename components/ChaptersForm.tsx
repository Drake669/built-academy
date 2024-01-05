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
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Chapters, Course } from "@prisma/client";
import { Input } from "./ui/input";

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

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${initialData.id}/chapters`,
        values
      );
      toggleCreating();
      router.refresh();
      toast.success("Chapter has been created");
    } catch (error) {
      toast.error("Chapter creation failed");
    }
  };

  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };
  return (
    <div className=" mt-5 bg-slate-200 rounded-lg p-5">
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
        {!isCreating &&
          initialData.chapters.length > 0 &&
          initialData.chapters.map((chapter) => (
            <p key={chapter.id}>{chapter.title}</p>
          ))}
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
