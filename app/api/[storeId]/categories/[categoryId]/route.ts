import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{categoryId:string}}){
    try {
        if(!params.categoryId){
            return new NextResponse("CategoryId is required", {status:400})
        }

        const category = await prismadb.category.findUnique({
            where:{
                id: params.categoryId,
            },
            include:{
                billboard:true,
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function PATCH(req:Request,{params}:{params:{storeId:string,categoryId:string}}){
    try {
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
        if(!params.categoryId){
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

        const category = await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
                storeId: params.storeId,
            },
            data:{
                name,billboardId
            }
        })

        return NextResponse.json(category,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,categoryId:string}}){
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.categoryId){
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

        const category = await prismadb.category.deleteMany({
            where:{
                id: params.categoryId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}