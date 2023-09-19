import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try{
        const {userId} = auth()
        const body =await req.json()
        if(!userId){
            return new NextResponse("User not found", {status:401})
        }
        const {name} = body
        if(!name){
            return new NextResponse("Name is required", {status:400})
        }
        const store = await prismadb.store.create({data:{name, userId}})
        return NextResponse.json(store,{status:201})
    }catch(err){
        console.log('Stores Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}