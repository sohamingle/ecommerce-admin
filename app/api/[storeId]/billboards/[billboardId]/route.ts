import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{storeId:string,billboardId:string}}){
    try {

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.billboardId){
            return new NextResponse("StoreId is required", {status:400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where:{
                id: params.billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function PATCH(req:Request,{params}:{params:{storeId:string,billboardId:string}}){
    try {
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
        if(!params.billboardId){
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

        const updatedBillboard = await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId,
                storeId: params.storeId,
            },
            data:{
                label,imageUrl,labelColor
            }
        })

        return NextResponse.json(updatedBillboard,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,billboardId:string}}){
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.billboardId){
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

        const deleteBillboard = await prismadb.billboard.deleteMany({
            where:{
                id: params.billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(deleteBillboard,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}