"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface Props{
    data:CategoryColumn[]
}

const CategoryClient:React.FC<Props> = ({data}) => {

    const router = useRouter()
    const params = useParams()

    const title = `Category (${data.length})`

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title}
                description="Manage categories for your store"/>
                <Button onClick={()=>{router.push(`/${params.storeId}/categories/new`)}}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey="name"/>
        </>
    );
}

export default CategoryClient;