import MobileSidebar from "./MobileSidebar";
import NavbarRoutes from "./NavbarRoutes";

const Navbar = () => {
  return (
    <div className="border-b shadow-sm mb-10 flex bg-white items-center p-4 h-full">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
