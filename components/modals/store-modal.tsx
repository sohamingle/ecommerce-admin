"use client"

import * as z from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { useState } from 'react'
import axios from 'axios'

import { Modal } from "@/components/ui/modal"

import { useStoreModalStore } from "@/hooks/use-store-modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

export const StoreModal: React.FC = () => {
   const [loading,setLoading] =useState(false) 
   const storeModal = useStoreModalStore()

   const formSchema = z.object({
      name: z.string().min(3).max(20),
   })

   const form = useForm<z.infer<typeof formSchema>>({
      resolver:zodResolver(formSchema),
      defaultValues: {
         name: "",
      },
   })
   
   const onSubmit = async(values: z.infer<typeof formSchema>)=> {
      try{
         setLoading(true)
         const response = await axios.post('/api/stores',values)
         window.location.assign(`/${response.data.id}`)
         toast.success("Store created successfully")
      }catch(err){
         toast.error("Something went wrong")
      }finally{
         setLoading(false)
      }
    }
  

   return (
      <Modal
        title="Create store"
        description="Add a new store to manage products and categories."
         isOpen={storeModal.isOpen}
         onClose={storeModal.onClose}
         >
         <div>
            <div className='space-y-4 py-2 pb-4'>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <FormField
                     control={form.control}
                     name="name"
                     render={({field})=>(
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input  placeholder="Enter your store name..."
                           disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                        <div className='flex justify-end items-center pt-6 space-x-4'>
                           <Button onClick={storeModal.onClose} variant={'secondary'}
                           disabled={loading}>Cancel</Button>
                           <Button type='submit'
                           disabled={loading}>Create</Button>
                        </div>
                        </FormItem>
                     )}
                     />
                  </form>
               </Form>
            </div>
         </div>
         </Modal>
   )

}