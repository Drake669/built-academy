import Navbar from "@/components/Navbar";
import SideBar from "@/components/Sidebar/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] w-full md:pl-60 fixed inset-y-0 z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex w-60 fixed flex-col inset-y-0 h-full z-50">
        <SideBar />
      </div>
      <main className="md:pl-60 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
