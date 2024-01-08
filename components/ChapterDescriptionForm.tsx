"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chapters } from "@prisma/client";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import Editor from "./Editor";
import Preview from "./Preview";

const formSchema = z.object({
  description: z.string(),
});

interface ChapterDescriptionFormProps {
  initialData: Chapters;
  courseId: string;
}

const ChapterDescriptionForm = ({
  initialData,
  courseId,
}: ChapterDescriptionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const [isEditting, setIsEditting] = useState(false);
  const [description, setDescription] = useState("");

  const onChange = (value: string) => {
    setDescription(value);
  };

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${initialData.id}`,
        { description }
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
        Chapter Description
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
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <span
            className={cn(!initialData.description && "text-slate-500 italic")}
          >
            {initialData.description ? (
              <Preview value={description} />
            ) : (
              "No description"
            )}
          </span>
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Editor onChange={onChange} value={description} />
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
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterDescriptionForm;
