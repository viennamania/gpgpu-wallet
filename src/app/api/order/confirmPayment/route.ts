import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	confirmPayment,
  getOrderById,
} from '@lib/api/order';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";




import {
  createThirdwebClient,
  eth_getTransactionByHash,
  getContract,
  sendAndConfirmTransaction,
  
  sendBatchTransaction,


} from "thirdweb";

//import { polygonAmoy } from "thirdweb/chains";
import {
  polygon,
  arbitrum,
 } from "thirdweb/chains";

import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  
 } from "thirdweb/wallets";


import {
  mintTo,
  totalSupply,
  transfer,
  
  getBalance,

  balanceOf,

} from "thirdweb/extensions/erc20";



// nextjs-app
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

//nextjs /pages/api
/*
export const config = {
	//runtime: 'edge',
	maxDuration: 120, // This function can run for a maximum of 60 seconds
};
*/





//const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

const contractAddressArbitrum = "0x2f2a2543B76A4166549F7aab2e75Bef0aefC5B0f"; // USDT on Arbitrum






export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, orderId, paymentAmount } = body;

  console.log("lang", lang);
  console.log("chain", chain);

  console.log("orderId", orderId);

  console.log("paymentAmount", paymentAmount);






  
  try {



    // get buyer wallet address


    const order = await getOrderById( orderId );

    const {
      usdtAmount: usdtAmount,
      buyer: buyer,
    } = order as UserProps;





    const toAddressStore = buyer.walletAddress;

    const sendAmountToStore = usdtAmount;


    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });



    const account = privateKeyToAccount({
      client,
      privateKey: process.env.WALLET_PRIVATE_KEY || "",
    });
  


    let sendDataStore = null;

    
    if (chain === "polygon") {
      const contract = getContract({
        client,
        chain: polygon,
        address: tokenContractAddressUSDT, // erc20 contract from thirdweb.com/explore
      });
    
              
      const transactionSendToStore = transfer({
        contract,
        to: toAddressStore,
        amount: sendAmountToStore,
      });

      sendDataStore = await sendAndConfirmTransaction({
        transaction: transactionSendToStore,
        account: account,
      });
 
    } else if (chain === "arbitrum") {
      const contract = getContract({
        client,
        chain: arbitrum,
        address: contractAddressArbitrum, // erc20 contract from thirdweb.com/explore
      });
    
              
      const transactionSendToStore = transfer({
        contract,
        to: toAddressStore,
        amount: sendAmountToStore,
      });

      sendDataStore = await sendAndConfirmTransaction({
        transaction: transactionSendToStore,
        account: account,
      });
 
    }



    if (sendDataStore) {

      console.log("Sent successfully!");

      console.log(`Transaction hash: ${sendDataStore.transactionHash}`);
    

      const result = await confirmPayment({
        lang: lang,
        chain: chain,
        orderId: orderId,
        paymentAmount: paymentAmount,
        transactionHash: sendDataStore.transactionHash,
      });
    
    
      //console.log("result", JSON.stringify(result));
    
      const {
        nickname: nickname,
        mobile: mobile,
        seller: seller,
        buyer: buyer,
        tradeId: tradeId,
        usdtAmount: usdtAmount,
        krwAmount: krwAmount,
        transactionHash: transactionHash,
      } = result as UserProps;
    
    
    
      const amount = usdtAmount;
    
    
        // send sms


        if (!buyer.mobile) {
          return NextResponse.json({
            result,
          });
        }


        // check buyer.mobile is prefixed with +
        if (!buyer.mobile.startsWith("+")) {
          return NextResponse.json({
            result,
          });
        }


    
        const to = buyer.mobile;
    
    
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);
    
    
    
        let message = null;


        try {
    
    
          const msgBody = `[GOODT] TID[${tradeId}] You received ${amount} USDT from ${nickname}! https://goodtether.com/${lang}/${chain}/sell-usdt/${orderId}`;
      
          message = await client.messages.create({
            ///body: "This is the ship that made the Kessel Run in fourteen parsecs?",
            body: msgBody,
            from: "+17622254217",
            to: to,
          });
      
          console.log(message.sid);

        } catch (error) {
            
          console.log("error", error);
      
        }
    
    
    
    
    
     
      return NextResponse.json({
    
        result,
        
      });



    }





  } catch (error) {
      
    console.log(" error=====>" + error);



  }

  


 
  return NextResponse.json({

    result: null,
    
  });
  
}
