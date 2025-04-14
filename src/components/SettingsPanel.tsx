"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const settingsSchema = z.object({
  dataFetchingFrequency: z.string().describe("Time in seconds"),
  customScripts: z.string().optional(),
  searxngUrl: z.string().url({ message: "Invalid URL format" }).describe("SearxNG URL"),
  apiProvider: z.string().describe("API Provider"),
  apiKey: z.string().describe("API Key"),
});

interface SettingsPanelProps {}

const SettingsPanel: React.FC<SettingsPanelProps> = () => {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      dataFetchingFrequency: "60",
      customScripts: "",
      searxngUrl: "",
      apiProvider: "",
      apiKey: "",
    },
  });

  const [apiProviders, setApiProviders] = useState([
    { id: "1", name: "Google AI" },
    { id: "2", name: "Groq" },
  ]);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values);
    // Implement save settings and news fetching logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UI Settings Panel</CardTitle>
        <CardDescription>
          Configure data fetching frequency, custom scripts, news settings, and
          API provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dataFetchingFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Fetching Frequency (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter data fetching frequency"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the frequency for fetching live data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customScripts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Scripts</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter custom scripts for data integration"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add custom scripts for advanced data integration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searxngUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SearxNG URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter SearxNG URL"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The URL of your SearxNG instance.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select API Provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {apiProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.name}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the default API provider.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter API Key"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the API key for the selected provider.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
