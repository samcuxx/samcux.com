import { Metadata } from "next";
import { AdminNavigation } from "@/components/admin/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your portfolio website",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center h-16 px-4 border-b bg-background sticky top-0 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="h-full py-6 px-4">
              <AdminNavigation inSheet={true} />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="font-semibold text-lg">Admin Dashboard</h1>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed top-0 left-0 bottom-0 z-50">
        <div className="h-full border-r bg-background px-4 py-6">
          <div className="mb-6 px-2">
            <h1 className="font-bold text-xl">Portfolio Admin</h1>
          </div>
          <AdminNavigation inSheet={false} />
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72 flex-1">
        <div className="h-full p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 