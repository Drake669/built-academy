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
import { Pencil } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import formatNumber from "@/lib/format";

const formSchema = z.object({
  price: z.coerce.number(),
});

interface PriceFormProps {
  initialData: {
    price: number | null;
    id: string;
  };
}

const PriceForm = ({ initialData }: PriceFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
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
        Course Price
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
              Edit price
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm">
        {!isEditting ? (
          <div className={cn(!initialData.price && "text-slate-400 italic ")}>
            {initialData.price ? formatNumber(initialData.price) : "No price"}
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          step={0.01}
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
          </>
        )}
      </div>
    </div>
  );
};

export default PriceForm;
