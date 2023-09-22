import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{storeId:string,sizeId:string}}){
    try {

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.sizeId){
            return new NextResponse("StoreId is required", {status:400})
        }

        const size = await prismadb.size.findUnique({
            where:{
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function PATCH(req:Request,{params}:{params:{storeId:string,sizeId:string}}){
    try {
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
        if(!params.sizeId){
            return new NextResponse("Category is required", {status:400})
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

        const size = await prismadb.size.updateMany({
            where:{
                id:params.sizeId,
                storeId: params.storeId,
            },
            data:{
                name,value
            }
        })

        return NextResponse.json(size,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,sizeId:string}}){
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.sizeId){
            return new NextResponse("Category is required", {status:400})
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

        const size = await prismadb.size.deleteMany({
            where:{
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(size,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}