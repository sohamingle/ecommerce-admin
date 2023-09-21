"use client";

import { AlignJustifyIcon, CopyCheckIcon, PencilIcon, TrashIcon } from "lucide-react";
import { BillboardColumn } from "./column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AlerModal from "@/components/modals/alert-modal";
import { useState } from "react";

interface Props {
  data: BillboardColumn;
}

const CellAction: React.FC<Props> = ({ data }) => {


    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    const router = useRouter()
    const params = useParams()

    const onCopy = () =>{
        navigator.clipboard.writeText(data.id)
        toast.success('Copied to clipboard')
    }

    const onEdit = () =>{
        router.push(`/${params.storeId}/billboards/${data.id}`)
    }

    const onDelete = async() =>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            toast.success('Successfully Removed')
            router.refresh()
        }catch(err){
            toast.error("Make sure you remove all categories first")
            console.log(err)
        }finally{
            setOpen(false)
            setLoading(false)
        }
    }


  return (
    <>
    {open && <AlerModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading} />}
    <DropdownMenu>
      <DropdownMenuTrigger><AlignJustifyIcon className="h-4 w-4"/></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{data.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCopy} className="cursor-pointer"><CopyCheckIcon className="h-4 w-4 mr-2"/>Copy ID</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer"><PencilIcon className="h-4 w-4 mr-2"/>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>setOpen(true)} className="bg-red-600 text-white cursor-pointer"><TrashIcon className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
};

export default CellAction;
