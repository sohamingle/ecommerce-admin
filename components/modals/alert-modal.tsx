"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

interface Props{
    isOpen:boolean;
    onClose:()=>void;
    onConfirm:()=>void;
    loading:boolean;
}

const AlerModal:React.FC<Props> = ({isOpen,onClose,onConfirm,loading}) => {

    const [isMounted,setIsMounted]= useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }

    return (
        <Modal title="Are you sure?" description="This action cannot be undone." isOpen={isOpen} onClose={onClose}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant={"outline"} onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant={'destructive'} onClick={onConfirm}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
}

export default AlerModal;