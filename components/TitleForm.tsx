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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

interface TitleFormProps {
  initialData: {
    title: string;
    id: string;
  };
}

const TitleForm = ({ initialData }: TitleFormProps) => {
  const router = useRouter( );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });

  const [isEditting, setIsEditting] = useState(false);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${initialData.id}`,
        values
      );
      toggleEditing();
      router.refresh();
      toast.success("Course has been updated successfully");
    } catch (error) {
      toast.error("Course update failed");
    }
  };

  const toggleEditing = () => {
    setIsEditting(!isEditting);
  };
  return (
    <div className=" mt-5 bg-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between font-medium">
        Course Title
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
              Edit title
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <>{initialData.title}</>
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g 'Introduction to Accounting'"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        What will you teach in this course
                      </FormDescription>
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

export default TitleForm;
