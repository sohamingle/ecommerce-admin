"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface Props{
    data:OrderColumn[]
}

const OrderClient:React.FC<Props> = ({data}) => {

    const router = useRouter()
    const params = useParams()

    const title = `Orders (${data.length})`

    return (
        <>
            <Heading title={title}
            description="Manage billboards for your store"/>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey="products"/>
        </>
    );
}

export default OrderClient;