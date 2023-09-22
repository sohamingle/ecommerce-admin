"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface Props{
    data:ProductColumn[]
}

const ProductClient:React.FC<Props> = ({data}) => {

    const router = useRouter()
    const params = useParams()

    const title = `Products (${data.length})`

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title}
                description="Manage billboards for your store"/>
                <Button onClick={()=>{router.push(`/${params.storeId}/products/new`)}}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey="name"/>
        </>
    );
}

export default ProductClient;