import ChapterDescriptionForm from "@/components/ChapterDescriptionForm";
import ChapterTitleForm from "@/components/ChapterTitleForm";
import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ChapterEditPage = async ({
  params,
}: {
  params: { courseId: string; id: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapters.findUnique({
    where: {
      id: params.id,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const completedFields = requiredFields.filter(Boolean).length;
  const completedText = `(${completedFields}/${requiredFields.length})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Back to courses page</span>
          </Link>
          <div className="flex flex-col gap-y-2 mb-16">
            <div className="text-2xl font-semibold">Chapter Creation</div>
            <div className="text-sm text-slate-500">
              Complete all fields {completedText}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Customize your chapter</h2>
                </div>
                <ChapterTitleForm
                  initialData={chapter}
                  courseId={params.courseId}
                />
                <ChapterDescriptionForm
                  initialData={chapter}
                  courseId={params.courseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditPage;
