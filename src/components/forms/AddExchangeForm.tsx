
"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const addExchangeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Exchange name must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  socialMediaLink: z.string().url({
    message: "Invalid URL format.",
  }),
  timeZone: z.string().min(3, {
    message: "Time zone must be at least 3 characters.",
  }),
  holidaySchedule: z.string().optional(),
  webLink: z.string().url({
    message: "Invalid URL format.",
  }),
});

function AddExchangeForm() {
  const form = useForm<z.infer<typeof addExchangeFormSchema>>({
    resolver: zodResolver(addExchangeFormSchema),
    defaultValues: {
      name: "",
      country: "",
      socialMediaLink: "",
      timeZone: "",
      holidaySchedule: "",
      webLink: "",
    },
  });

  function onSubmit(values: z.infer<typeof addExchangeFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter exchange name" {...field} />
              </FormControl>
              <FormDescription>
                This is the official name of the stock exchange.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Enter country" {...field} />
              </FormControl>
              <FormDescription>
                Country where the exchange is located.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socialMediaLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Media Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter social media link" {...field} />
              </FormControl>
              <FormDescription>
                Link to the official social media page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <FormControl>
                <Input placeholder="Enter time zone" {...field} />
              </FormControl>
              <FormDescription>
                Specify the time zone for this exchange.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="holidaySchedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holiday Schedule</FormLabel>
              <FormControl>
                <Input placeholder="Enter holiday schedule" {...field} />
              </FormControl>
              <FormDescription>
                Details of the exchange holiday schedule.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="webLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Web Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter web link" {...field} />
              </FormControl>
              <FormDescription>
                Link to the official website of the exchange.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Exchange</Button>
      </form>
    </Form>
  );
}

export default AddExchangeForm;

