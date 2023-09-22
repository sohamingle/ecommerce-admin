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
            return new NextResponse("Value is required", {status:400})
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

        const size = await prismadb.size.create({data:{name,value,storeId:params.storeId}})
        return NextResponse.json(size,{status:201})
    }catch(err){
        console.log('Size Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function GET(req: Request ,{params}:{params:{storeId:string}}){
    try{
        const sizes = await prismadb.size.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(sizes,{status:200})
    }catch(err){
        console.log('Size Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}