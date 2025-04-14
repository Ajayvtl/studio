
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

const addCountryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Country name must be at least 2 characters.",
  }),
  isoCode: z.string().length(2, {
    message: "ISO code must be exactly 2 characters.",
  }),
  timeZone: z.string().min(3, {
    message: "Time zone must be at least 3 characters.",
  }),
});

function AddCountryForm() {
  const form = useForm<z.infer<typeof addCountryFormSchema>>({
    resolver: zodResolver(addCountryFormSchema),
    defaultValues: {
      name: "",
      isoCode: "",
      timeZone: "",
    },
  });

  function onSubmit(values: z.infer<typeof addCountryFormSchema>) {
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
              <FormLabel>Country Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter country name" {...field} />
              </FormControl>
              <FormDescription>
                This is the official name of the country.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isoCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISO Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter ISO code" {...field} />
              </FormControl>
              <FormDescription>
                This is the two-letter ISO code for the country.
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
                Specify the time zone for this country.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Country</Button>
      </form>
    </Form>
  );
}

export default AddCountryForm;

