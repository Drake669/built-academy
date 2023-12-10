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
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Category, Course } from "@prisma/client";
import { Combobox } from "./ui/combobox";

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});

interface CategoryFormProps {
  initialData: Course;
  categories: { label: string; value: string }[];
}

const CategoryForm = ({ initialData, categories }: CategoryFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
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

  const selectedOption = categories.find(
    (option) => option.value === initialData.categoryId
  );
  return (
    <div className=" mt-5 bg-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between font-medium">
        Course Category
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
              Edit category
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <div
            className={cn(!initialData.categoryId && "text-slate-400 italic ")}
          >
            {selectedOption?.label || "No category"}
          </div>
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox options={...categories} {...field} />
                      </FormControl>
                      <FormDescription>
                        Select a category for the course
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

export default CategoryForm;
