"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  address: z.string().refine(
    (value) => {
      return (
        (value.startsWith("0x") &&
          value.length === 42 &&
          /^[a-zA-Z0-9]{3,}$/.test(value.slice(2))) ||
        (value.endsWith(".eth") && value.length >= 7)
      );
    },
    {
      message: "Paste a valid address or ENS name",
    }
  ),
});

export function AddressForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
    },
  });

  const router = useRouter();
  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/${data.address}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              {" "}
              <FormControl>
                <Input placeholder="Paste address or ENS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
