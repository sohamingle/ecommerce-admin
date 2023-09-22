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

        const product = await prismadb.product.create({data:{
            name,
            price,
            colorId,
            categoryId,
            sizeId,
            isFeatured,
            isArchived,
            storeId:params.storeId,
            images:{
                createMany:{
                    data:[
                        ...images.map((image:{url:string})=>image)
                    ]
                }
            },
        }})
        return NextResponse.json(product,{status:201})
    }catch(err){
        console.log('Product Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}



export async function GET(req: Request ,{params}:{params:{storeId:string}}){
    try{

        const {searchParams} = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured")

        const product = await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined
            },
            include:{
                images: true,
                category:true,
                color:true,
                size:true,
            },
            orderBy:{
                createdAt: "desc"
            }
        })
        return NextResponse.json(product,{status:200})
    }catch(err){
        console.log('Product Post',err)
        return new NextResponse('Internal Error',{status:500})
    }
}