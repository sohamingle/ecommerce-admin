"use client";

import AlerModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface Props {
  initialData: Category | null;
  billboards: Billboard[];
}

const CategoryForm: React.FC<Props> = ({ initialData , billboards}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const title = initialData ? "Edit Category" : "Create New Category";
  const description = initialData ? "Edit a Category" : "Add A New Category";
  const toastMessage = initialData ? "Category Updated" : "Category Created";
  const action = initialData ? "Save Changes" : "Create";

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      toast.success("Successfully Removed");
      router.refresh();
    } catch (err) {
      toast.error("Make sure you remove all products first");
      console.log(err);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <AlerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
          >
            <div className="grid grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Category Name"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="billboardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Billboard</FormLabel>
              <Select value={field.value} disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {billboards.map((item)=>(
                      <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default CategoryForm;
