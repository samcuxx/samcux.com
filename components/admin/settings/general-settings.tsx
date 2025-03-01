"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const generalFormSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteUrl: z.string().url("Must be a valid URL"),
  contactEmail: z.string().email("Must be a valid email"),
  enableBlog: z.boolean(),
  enableComments: z.boolean(),
  enableContactForm: z.boolean(),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

export function GeneralSettings() {
  const { toast } = useToast();
  const updateSettings = useMutation(api.settings.updateBatch);
  const settings = useQuery(api.settings.getAll);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "",
      siteUrl: "",
      contactEmail: "",
      enableBlog: true,
      enableComments: true,
      enableContactForm: true,
    },
  });

  // Load existing settings
  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings["general.siteName"] || "",
        siteUrl: settings["general.siteUrl"] || "",
        contactEmail: settings["general.contactEmail"] || "",
        enableBlog: settings["general.enableBlog"] ?? true,
        enableComments: settings["general.enableComments"] ?? true,
        enableContactForm: settings["general.enableContactForm"] ?? true,
      });
    }
  }, [settings, form]);

  async function onSubmit(data: GeneralFormValues) {
    try {
      setIsSaving(true);
      await updateSettings({
        settings: Object.entries(data).map(([key, value]) => ({
          key: `general.${key}`,
          value,
        })),
      });
      
      toast({
        title: "Settings saved",
        description: "Your general settings have been successfully saved.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update general settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Portfolio" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your portfolio website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://myportfolio.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL where your portfolio is hosted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The email address for contact form submissions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableBlog"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Blog
                    </FormLabel>
                    <FormDescription>
                      Show the blog section on your portfolio.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableComments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Comments
                    </FormLabel>
                    <FormDescription>
                      Allow visitors to comment on blog posts.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableContactForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Contact Form
                    </FormLabel>
                    <FormDescription>
                      Show the contact form on your portfolio.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button disabled={isSaving} type="submit" className="w-full sm:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save General Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 