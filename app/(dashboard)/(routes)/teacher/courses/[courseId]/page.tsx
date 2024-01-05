import AttachmentForm from "@/components/AttachmentForm";
import CategoryForm from "@/components/CategoryForm";
import DescriptionForm from "@/components/DescriptionForm";
import IconBadge from "@/components/IconBadge";
import ImageForm from "@/components/ImageForm";
import PriceForm from "@/components/PriceForm";
import TitleForm from "@/components/TitleForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  FolderIcon,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (userId !== course?.userId) {
    return redirect("/");
  }

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completedText = `(${completedFields}/${totalFields})`;
  return (
    <div className="p-6">
      <div className="flex flex-col">
        <h1 className="text-4xl">Course Setup</h1>
        <div className="text-sm text-slate-700">
          Complete all fields {completedText}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-10">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h1 className="text-xl">Customize your course</h1>
          </div>
          <div>
            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />
            <CategoryForm
              initialData={course}
              categories={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <div>
                <h2 className=" text-xl">Course Chapters</h2>
              </div>
            </div>
            <div>TODO: COurses</div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <div>
                <h2 className=" text-xl">Sell your course</h2>
              </div>
            </div>
            <PriceForm initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FolderIcon} />
              <div>
                <h2 className=" text-xl">Add your attachments</h2>
              </div>
            </div>
            <AttachmentForm initialData={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
