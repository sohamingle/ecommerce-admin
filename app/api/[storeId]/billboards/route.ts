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
        const {label,labelColor,imageUrl} = body
        if(!label){
            return new NextResponse("Label is required", {status:400})
        }
        if(!labelColor){
            return new NextResponse("Label is required", {status:400})
        }
        if(!imageUrl){
            return new NextResponse("ImageUrl is required", {status:400})
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

        const billboard = await prismadb.billboard.create({data:{label,imageUrl,labelColor,storeId:params.storeId}})
        return NextResponse.json(billboard,{status:201})
    }catch(err){
        console.log('Billboard Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function GET(req: Request ,{params}:{params:{storeId:string}}){
    try{
        const billboards = await prismadb.billboard.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboards,{status:200})
    }catch(err){
        console.log('Billboard Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}