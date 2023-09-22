import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request ,{params}:{params:{storeId:string}}){
    try{
        const {userId} = auth()
        const body =await req.json()
        if(!userId){
            return new NextResponse("User not found", {status:401})
        }
        const {name,value} = body
        if(!name){
            return new NextResponse("Name is required", {status:400})
        }
        if(!value){
            return new NextResponse("Billboard is required", {status:400})
        }
        if(!params.storeId){
            return new NextResponse("StoreId is required", {status:400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Store not found", {status:403})
        }

        const color = await prismadb.color.create({data:{name,value,storeId:params.storeId}})
        return NextResponse.json(color,{status:201})
    }catch(err){
        console.log('Color Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function GET(req: Request ,{params}:{params:{storeId:string}}){
    try{
        const colors = await prismadb.color.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(colors,{status:200})
    }catch(err){
        console.log('Colors Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}