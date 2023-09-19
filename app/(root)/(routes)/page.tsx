"use client"

import {useEffect} from 'react'

import { useStoreModalStore } from "@/hooks/use-store-modal"


export default function SetupPage() {

  const onOpen = useStoreModalStore((state)=>state.onOpen)
  const isOpen = useStoreModalStore((state)=>state.isOpen);

  useEffect(()=>{
    if(!isOpen){
      onOpen()
    }
  },[isOpen,onOpen]);

  return null
}
