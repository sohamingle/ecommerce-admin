"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

interface Props{
    initialData:Store
}

const formSchema = z.object({
    name: z.string().min(3)
})

type SettingFormValues = z.infer<typeof formSchema>

const SettingsForm:React.FC<Props> = ({initialData}) => {

    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    const form = useForm<SettingFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    })

    const onSubmit = (data:SettingFormValues)=>{
        console.log(data)
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage store preferences"/>
                <Button variant={'destructive'} size={'icon'} onClick={()=>{}}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator/>
        </>
    );
}

export default SettingsForm;