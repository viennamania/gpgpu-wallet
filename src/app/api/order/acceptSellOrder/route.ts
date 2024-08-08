import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	acceptSellOrder,
} from '@lib/api/order';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";
import { idCounter } from "thirdweb/extensions/farcaster/idRegistry";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, orderId, buyerWalletAddress, buyerNickname, buyerAvatar, buyerMobile, buyerMemo, depositName } = body;

  console.log("orderId", orderId);
  

  const result = await acceptSellOrder({
    lang: lang,
    chain: chain,
    orderId: orderId,
    buyerWalletAddress: buyerWalletAddress,
    buyerNickname: buyerNickname,
    buyerAvatar: buyerAvatar,
    buyerMobile: buyerMobile,
    buyerMemo: buyerMemo,
    depositName: depositName,

  });

  ////console.log("result", result);



  const {
    mobile: mobile,
    seller: seller,
    buyer: buyer,
    tradeId: tradeId,
  } = result as UserProps;


    // send sms

    const to = mobile;


    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);



    let message = null;

   

    try {

      let msgBody = '';

      if (lang === 'en') {
        msgBody = `[GOODT] TID[${tradeId}] Your sell order has been accepted by ${buyer?.nickname}! You must escrow USDT to proceed with the trade in 10 minutes!`;
      } else if (lang === 'kr') {
        msgBody = `[GOODT] TID[${tradeId}] ${buyer?.nickname}님이 구매 주문을 수락했습니다! 거래를 계속하기 위해 USDT를 에스크로해야 합니다!`;
      } else {
        msgBody = `[GOODT] TID[${tradeId}] Your sell order has been accepted by ${buyer?.nickname}! You must escrow USDT to proceed with the trade in 10 minutes!`;
      }



      message = await client.messages.create({
        body: msgBody,
        from: "+17622254217",
        to: to,
      });

      console.log(message.sid);

      
      /*
      let msgBody2 = '';

      if (lang === 'en') { 
        msgBody2 = `[GOODT] TID[${tradeId}] Check the trade: https://goodtether.com/${lang}/${chain}/sell-usdt/${orderId}`;
      } else if (lang === 'kr') {
        msgBody2 = `[GOODT] TID[${tradeId}] 거래 확인: https://goodtether.com/${lang}/${chain}/sell-usdt/${orderId}`;
      } else {
        msgBody2 = `[GOODT] TID[${tradeId}] Check the trade: https://goodtether.com/${lang}/${chain}/sell-usdt/${orderId}`;
      }


      message = await client.messages.create({
        body: msgBody2,
        from: "+17622254217",
        to: to,
      });

      console.log(message.sid);
      */

    } catch (e) {
      console.error('error', e);
    }




 
  return NextResponse.json({

    result,
    
  });
  
}
