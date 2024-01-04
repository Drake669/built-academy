import { Button } from "@/components/ui/button";
import Link from "next/link";

const CoursesPage = () => {
  return (
    <div className="p-2 flex">
      <Link href={"/teacher/create"}>
        <Button>New Course</Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
