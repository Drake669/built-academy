import Logo from "../Logo/Logo";
import SidebarRoutes from "../SidebarRoutes/SidebarRoutes";

const Sidebar = () => {
  return (
    <div className="border-r h-full shadow-sm overflow-y-hidden z-50">
      <div className="p-6 flex items-center">
        <Logo />
        <div
          className="font-bold text-blue-950
         text-lg ml-2"
        >
          BuiltAcademy
        </div>
      </div>
      <SidebarRoutes />
    </div>
  );
};

export default Sidebar;
