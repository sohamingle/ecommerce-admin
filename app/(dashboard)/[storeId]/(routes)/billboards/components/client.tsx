"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface Props{
    data:Billboard[]
}

const BillboardClient:React.FC<Props> = ({data}) => {

    const router = useRouter()
    const params = useParams()

    const title = `Billboards (${data.length})`

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title}
                description="Manage billboards for your store"/>
                <Button onClick={()=>{router.push(`/${params.storeId}/billboards/new`)}}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            
        </>
    );
}

export default BillboardClient;