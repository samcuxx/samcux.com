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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const themeFormSchema = z.object({
  defaultTheme: z.enum(["light", "dark", "system"]),
  allowThemeToggle: z.boolean(),
  primaryColor: z.string(),
  accentColor: z.string(),
  fontFamily: z.string(),
});

type ThemeFormValues = z.infer<typeof themeFormSchema>;

export function ThemeSettings() {
  const { toast } = useToast();
  const updateSettings = useMutation(api.settings.updateBatch);
  const settings = useQuery(api.settings.getAll);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      defaultTheme: "system",
      allowThemeToggle: true,
      primaryColor: "#000000",
      accentColor: "#0070f3",
      fontFamily: "Inter",
    },
  });

  // Load existing settings
  useEffect(() => {
    if (settings) {
      form.reset({
        defaultTheme: settings["theme.defaultTheme"] || "system",
        allowThemeToggle: settings["theme.allowThemeToggle"] ?? true,
        primaryColor: settings["theme.primaryColor"] || "#000000",
        accentColor: settings["theme.accentColor"] || "#0070f3",
        fontFamily: settings["theme.fontFamily"] || "Inter",
      });
    }
  }, [settings, form]);

  async function onSubmit(data: ThemeFormValues) {
    try {
      setIsSaving(true);
      await updateSettings({
        settings: Object.entries(data).map(([key, value]) => ({
          key: `theme.${key}`,
          value,
        })),
      });
      
      toast({
        title: "Settings saved",
        description: "Your theme settings have been successfully saved.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="defaultTheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Theme</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a default theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the default theme for your site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowThemeToggle"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Theme Toggle
                    </FormLabel>
                    <FormDescription>
                      Let users switch between light and dark themes.
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
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        {...field}
                        placeholder="#000000"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The main color used throughout your site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        {...field}
                        placeholder="#0070f3"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The secondary color used for highlights and accents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Family</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font family" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The main font family used across your site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSaving} type="submit" className="w-full sm:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Theme Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 