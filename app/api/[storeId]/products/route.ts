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
        const {name,billboardId} = body
        if(!name){
            return new NextResponse("Name is required", {status:400})
        }
        if(!billboardId){
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

        const category = await prismadb.category.create({data:{name,billboardId,storeId:params.storeId}})
        return NextResponse.json(category,{status:201})
    }catch(err){
        console.log('Billboard Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function GET(req: Request ,{params}:{params:{storeId:string}}){
    try{
        const categories = await prismadb.category.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(categories,{status:200})
    }catch(err){
        console.log('Category Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}