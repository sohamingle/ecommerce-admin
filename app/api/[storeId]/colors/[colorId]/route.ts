import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{storeId:string,colorId:string}}){
    try {

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.colorId){
            return new NextResponse("StoreId is required", {status:400})
        }

        const color = await prismadb.color.findUnique({
            where:{
                id: params.colorId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function PATCH(req:Request,{params}:{params:{storeId:string,colorId:string}}){
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
            return new NextResponse("Billboard is required", {status:400})
        }
        if(!params.storeId){
            return new NextResponse("StoreId is required", {status:400})
        }
        if(!params.colorId){
            return new NextResponse("Color is required", {status:400})
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

        const color = await prismadb.color.updateMany({
            where:{
                id:params.colorId,
                storeId: params.storeId,
            },
            data:{
                name,value
            }
        })

        return NextResponse.json(color,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,colorId:string}}){
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.colorId){
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

        const color = await prismadb.color.deleteMany({
            where:{
                id: params.colorId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(color,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}