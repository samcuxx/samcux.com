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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const seoFormSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  ogImage: z.string().url("Must be a valid URL").optional(),
  twitterHandle: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

export function SeoSettings() {
  const { toast } = useToast();
  const updateSettings = useMutation(api.settings.updateBatch);
  const settings = useQuery(api.settings.getAll);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      siteTitle: "",
      siteDescription: "",
      ogImage: "",
      twitterHandle: "",
      googleAnalyticsId: "",
    },
  });

  // Load existing settings
  useEffect(() => {
    if (settings) {
      form.reset({
        siteTitle: settings["seo.siteTitle"] || "",
        siteDescription: settings["seo.siteDescription"] || "",
        ogImage: settings["seo.ogImage"] || "",
        twitterHandle: settings["seo.twitterHandle"] || "",
        googleAnalyticsId: settings["seo.googleAnalyticsId"] || "",
      });
    }
  }, [settings, form]);

  async function onSubmit(data: SeoFormValues) {
    try {
      setIsSaving(true);
      await updateSettings({
        settings: Object.entries(data).map(([key, value]) => ({
          key: `seo.${key}`,
          value,
        })),
      });
      
      toast({
        title: "Settings saved",
        description: "Your SEO settings have been successfully saved.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SEO settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Portfolio" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title that appears in search engine results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A professional portfolio showcasing my work..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your site for search engines.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/og-image.jpg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    The image that appears when your site is shared on social media.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Handle</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="@username" 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your Twitter username for Twitter Card metadata.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="G-XXXXXXXXXX" 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your Google Analytics measurement ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSaving} type="submit" className="w-full sm:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save SEO Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 