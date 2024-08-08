import { NextResponse, type NextRequest } from "next/server";

import {
	insertOne,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { nickname, mobile } = body;


  try {
    //const walletAddress = "0

      // fetch wallet address for payment

    // https://corky.vercel.app/api/cryptopay/user/create?userid=2342323432

    /*
    // generate random userid for now from 1000000000 to 9999999999
    const usernumber = Math.floor(Math.random() * 10000000000) + 1000000000;

    const userid = usernumber + '@' + '2000001';
    */

    const userid = nickname;


    

    const data = await fetch(`https://corky.vercel.app/api/cryptopay/user/create?userid=${userid}`);

    const json = await data.json();

    if (!json.data) {
      throw new Error("No wallet address found");
    }

    const walletAddress = json.data;


    console.log("walletAddress", walletAddress);




    const result = await insertOne({
      walletAddress: walletAddress,
      nickname: nickname,
      mobile: mobile,
    });

    // return wallet address to user

    return NextResponse.json({

      result,
      walletAddress,
      
    });


  } catch (error) {
    console.log("error", error);

    return NextResponse.json({
      error,
      
    });
  }


 

  
}
