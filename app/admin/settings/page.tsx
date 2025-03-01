"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoSettings } from "@/components/admin/settings/seo-settings";
import { ThemeSettings } from "@/components/admin/settings/theme-settings";
import { GeneralSettings } from "@/components/admin/settings/general-settings";
import { PageHeader } from "@/components/admin/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your site settings and configurations"
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="seo" className="space-y-4">
          <SeoSettings />
        </TabsContent>
        <TabsContent value="theme" className="space-y-4">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 