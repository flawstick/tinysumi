import "@/styles/globals.css";
import { type Metadata } from "next";
import { auth } from "@/server/auth";
import AccessBlock from "../_components/access-block";
import { AdminSidebar } from "../_components/admin/sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tiny App",
  description: "Created by her daddy",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role === "tiny") return <AccessBlock />;
  if (session?.user?.role !== "daddy") return redirect("/");

  return (
    // This ThemeProvider will override the parent's forcedTheme
    <ThemeProvider attribute="class" forcedTheme="dark">
      <div className="dark min-h-screen bg-background text-foreground">
        <AdminSidebar />

        {/* Main content */}
        <main
          className={cn(
            "min-h-screen bg-background text-foreground transition-all duration-200 ease-in-out",
            "p-6 md:ml-64",
          )}
        >
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
