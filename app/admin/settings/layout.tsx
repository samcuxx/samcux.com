import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Admin Dashboard",
  description: "Manage your site settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 