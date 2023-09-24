import Razorpay from "razorpay";
import { razorpay } from "@/lib/razorpay";
import {  NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import shortid from "shortid";

const corsHeaders = {
    "Access-Control-Allow-Origin": "https://ecommerce-store-xi-rust.vercel.app/",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
}

export async function OPTIONS(){
    return NextResponse.json({},{headers:corsHeaders})
}

export async function POST(req:Request,{params}:{params:{storeId:string}}) {

    try {

        const { productIds } = await req.json();

        if (!productIds || productIds.length === 0) {
          return new NextResponse("Product ids are required", { status: 400 });
        }
      
        const products = await prismadb.product.findMany({
          where: {
            id: {
              in: productIds
            }
          }
        });

        const order = await prismadb.order.create({
            data: {
              storeId: params.storeId,
              isPaid: false,
              orderItems: {
                create: productIds.map((productId: string) => ({
                  product: {
                    connect: {
                      id: productId
                    }
                  }
                }))
              }
            }
          });

            // Create an order -> generate the OrderID -> Send it to the Front-end
            const payment_capture = 1;
            const amount = products.reduce((sum, product)=>{return sum + Number(product.price)},0)
            const currency = "INR";
            const options = {
              amount: (amount * 100).toString(),
              currency,
              receipt: shortid.generate(),
              payment_capture,
            };
        
        const response = await razorpay.orders.create(options);
        return NextResponse.json({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
          order_status: order.id
        },{headers:corsHeaders});
      } catch (err) {
        console.log(err);
        return new NextResponse('Error',{status:400})
      }

      
}


export async function PUT(req:Request,{params}:{params:{storeId:string}}) {

    const orderId = await req.text()
    const order = await prismadb.order.update({
        where:{
            id:orderId,
            storeId:params.storeId
        },
        data:{
            isPaid:true
        }
    })
    return NextResponse.json(order,{headers:corsHeaders , status:200})
}