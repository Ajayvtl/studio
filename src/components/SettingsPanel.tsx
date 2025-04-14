
"use client";

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

const settingsSchema = z.object({
  dataFetchingFrequency: z.string().describe("Time in seconds"),
  customScripts: z.string().optional(),
});

function SettingsPanel() {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      dataFetchingFrequency: "60",
      customScripts: "",
    },
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UI Settings Panel</CardTitle>
        <CardDescription>
          Configure data fetching frequency and custom scripts.
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
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SettingsPanel;

