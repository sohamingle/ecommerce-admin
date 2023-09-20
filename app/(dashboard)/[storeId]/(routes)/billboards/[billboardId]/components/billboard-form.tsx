"use client"

import AlerModal from "@/components/modals/alert-modal";
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from 'zod'
import ImageUpload from "./image-upload";

const formSchema = z.object({
    label: z.string().min(3),
    imageUrl : z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>

interface Props{
    initialData:Billboard | null
}


const BillboardForm:React.FC<Props> = ({initialData}) => {

    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const form = useForm<BillboardFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label:'',
            imageUrl:'',
        }
    })

    const title = initialData ? "Edit Billboard" : "Create New Billboard"
    const description = initialData ? "Edit a Billboard" : "Add A New Billboard"
    const toastMessage = initialData ? "Billboard Updated" : "Billboard Created"
    const action = initialData ? "Save Changes" : "Create"

    const onSubmit = async(data:BillboardFormValues)=>{
        setLoading(true)
        try{
            await axios.patch(`/api/stores/${params.storeId}`,data)
            router.refresh()
            router.push('/')
            toast.success("Store Updated")
        }catch(err){
            toast.error("Something went wrong")
        }finally{
            setLoading(false)
        }
    }

    const onDelete = async() =>{
        try{
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            toast.success("Successfully deleted")
            router.refresh()
        }catch(err){
            toast.error("Make sure you remove all the products and categories first")
            console.log(err)
        }finally{
            setOpen(false)
            setLoading(false)
        }
    }

    return (
        <>
            <AlerModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading}/>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}/>
                {initialData && <Button disabled={loading} variant={'destructive'} size={'icon'} onClick={()=>{setOpen(true)}}>
                    <Trash className="h-4 w-4"/>
                </Button>}
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                     control={form.control}
                     name="imageUrl"
                     render={({field})=>(
                        <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                           <ImageUpload disabled={loading} value={field.value ? [field.value] : []} onChange={(url)=>field.onChange(url)} onRemove={()=>field.onChange('')}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                     )}
                     />
                    <div className="grid grid-cols-3 gap-8">
                    <FormField
                     control={form.control}
                     name="label"
                     render={({field})=>(
                        <FormItem>
                        <FormLabel>Billboard Label</FormLabel>
                        <FormControl>
                           <Input  placeholder="Billboard Name"
                           disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                     )}
                     />

                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">{action}</Button>
                </form>
            </Form>
            <Separator/>
        </>
    );
}

export default BillboardForm;