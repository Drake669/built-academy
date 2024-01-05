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
import { ImageIcon, Pencil, PlusIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "./FileUpload";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

interface ImageFormProps {
  initialData: Course;
}

const ImageForm = ({ initialData }: ImageFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData.imageUrl || "",
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
        Course Image
        <Button
          variant={"ghost"}
          onClick={() => {
            toggleEditing();
          }}
        >
          {isEditting ? (
            <>Cancel</>
          ) : initialData.imageUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add image
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <div>
            {initialData.imageUrl ? (
              <div className="relative aspect-video mt-2">
                <Image
                  src={initialData.imageUrl}
                  fill
                  sizes="(max-width:700px)"
                  priority
                  alt={`${initialData.title}`}
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="bg-slate-100 flex items-center justify-center h-60 rounded-md">
                <ImageIcon className="text-slate-500 h-10 w-10" />
              </div>
            )}
          </div>
        ) : (
          <div>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <div className="text-sm text-muted-foreground">
              16:9 recommended aspect ratio
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageForm;
