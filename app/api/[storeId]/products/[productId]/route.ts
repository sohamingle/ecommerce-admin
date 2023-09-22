import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{storeId:string,productId:string}}){
    try {

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.productId){
            return new NextResponse("ProductID is required", {status:400})
        }

        const product = await prismadb.product.findUnique({
            where:{
                id: params.productId,
                storeId: params.storeId
            },
            include:{
                images: true,
                category:true,
                color:true,
                size:true,
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function PATCH(req:Request,{params}:{params:{storeId:string,productId:string}}){
    try {
        const {userId} = auth()
        const body =await req.json()
        if(!userId){
            return new NextResponse("User not found", {status:401})
        }
        const {
            name,
            images,
            price,
            categoryId,
            sizeId,
            colorId,
            isFeatured,
            isArchived
        } = body
        if(!name){
            return new NextResponse("Name is required", {status:400})
        }
        if(!price){
            return new NextResponse("Price is required", {status:400})
        }
        if(!categoryId){
            return new NextResponse("Category is required", {status:400})
        }
        if(!colorId){
            return new NextResponse("Color is required", {status:400})
        }
        if(!sizeId){
            return new NextResponse("SIze is required", {status:400})
        }
        if(!images || !images.length){
            return new NextResponse("Images are required", {status:400})
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

        await prismadb.product.update({
            where:{
                id:params.productId,
                storeId: params.storeId,
            },
            data:{
                name,
                price,
                colorId,
                categoryId,
                sizeId,
                isFeatured,
                isArchived,
                images:{
                    deleteMany:{}
                },
            }
        })

        const product = await prismadb.product.update({
            where:{
                id:params.productId,
                storeId: params.storeId,
            },
            data:{
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,productId:string}}){
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }

        if(!params.storeId){
            return new NextResponse('Store ID is required',{status:400})
        }
        if(!params.productId){
            return new NextResponse("Product is required", {status:400})
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

        const product = await prismadb.product.deleteMany({
            where:{
                id: params.productId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(product,{status:200})

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Error',{status:500})
    }
}