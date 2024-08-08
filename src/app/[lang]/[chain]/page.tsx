'use client';

import { useState, useEffect, use } from "react";

import Image from "next/image";

import thirdwebIcon from "@public/thirdweb.svg";


import { client } from "../../client";

//import { createThirdwebClient } from "thirdweb";

import {
  //ThirdwebProvider,
  ConnectButton,

  useConnect,

  useReadContract,

  useActiveWallet,

  useActiveAccount,

  
  
} from "thirdweb/react";

import { inAppWallet } from "thirdweb/wallets";

import {
  polygon,
  arbitrum,
} from "thirdweb/chains";


import {
  getContract,
  //readContract,
} from "thirdweb";


import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import { getUserPhoneNumber } from "thirdweb/wallets/in-app";


import { toast } from 'react-hot-toast';

import { useRouter }from "next//navigation";
import { add } from "thirdweb/extensions/farcaster/keyGateway";


import { getOwnedNFTs } from "thirdweb/extensions/erc721";


import GearSetupIcon from "@/components/gearSetupIcon";


//import LanguageSelector from "@/components/LanguageSelector";

import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../dictionaries";



/*
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "",
});
*/





const wallets = [
  inAppWallet({
    auth: {
      options: ["phone"],
    },
  }),
];


const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon

const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum





export default function Index({ params }: any) {


  console.log("params", params);




  const contract = getContract({
    // the client you have created via `createThirdwebClient()`
    client,
    // the chain the contract is deployed on
    
    
    chain: params.chain === "arbitrum" ? arbitrum : polygon,
  
  
  
    // the contract's address
    ///address: contractAddress,

    address: params.chain === "arbitrum" ? contractAddressArbitrum : contractAddress,


    // OPTIONAL: the contract's abi
    //abi: [...],
  });


  




  const [data, setData] = useState({
    title: "",
    description: "",

    menu : {
      buy: "",
      sell: "",
      trade: "",
      chat: "",
      history: "",
      settings: "",
    },

    Go_Home: "",
    My_Balance: "",
    My_Nickname: "",
    My_Buy_Trades: "",
    My_Sell_Trades: "",
    Buy: "",
    Sell: "",
    Buy_USDT: "",
    Sell_USDT: "",
    Contact_Us: "",
    Buy_Description: "",
    Sell_Description: "",
    Send_USDT: "",
    Pay_USDT: "",
    Coming_Soon: "",
    Open_Orders: "",
    Please_connect_your_wallet_first: "",
    Please_verify_your_account_first_for_selling: "",

    Nickname_saved: "",
    You_must_enter_different_nickname: "",

    Enter_your_bank_name: "",
    Enter_your_account_number: "",
    Enter_your_account_holder: "",
    To_become_a_seller_you_need_to_send_1_USDT_to_the_contract_address: "",

    Apply_for_Seller: "",

  } );

  useEffect(() => {
      async function fetchData() {
          const dictionary = await getDictionary(params.lang);
          setData(dictionary);
      }
      fetchData();
  }, [params.lang]);

  const {
    title,
    description,
    menu,
    Go_Home,
    My_Balance,
    My_Nickname,
    My_Buy_Trades,
    My_Sell_Trades,
    Buy,
    Sell,
    Buy_USDT,
    Sell_USDT,
    Contact_Us,
    Buy_Description,
    Sell_Description,
    Send_USDT,
    Pay_USDT,
    Coming_Soon,
    Open_Orders,
    Please_connect_your_wallet_first,
    Please_verify_your_account_first_for_selling,

    Nickname_saved,
    You_must_enter_different_nickname,

    Enter_your_bank_name,
    Enter_your_account_number,
    Enter_your_account_holder,
    To_become_a_seller_you_need_to_send_1_USDT_to_the_contract_address,

    Apply_for_Seller,

  } = data;










  //const { connect, isConnecting, error } = useConnect();

  ///console.log(isConnecting, error);



  const router = useRouter();

  





  // get the active wallet
  const activeWallet = useActiveWallet();



  // get wallet address

  //const address = activeWallet?.getAccount()?.address || "";
  

  const smartAccount = useActiveAccount();

  const address = smartAccount?.address || "";


  console.log('address', address);




  const [balance, setBalance] = useState(0);

  useEffect(() => {

    if (!address) return;
    // get the balance


    if (!contract) {
      return;
    }

    const getBalance = async () => {

      try {
        const result = await balanceOf({
          contract,
          address: address,
        });
    
        //console.log(result);
    
        setBalance( Number(result) / 10 ** 6 );

      } catch (error) {
        console.error("Error getting balance", error);
      }

    };

    if (address) getBalance();

    // get the balance in the interval

    const interval = setInterval(() => {
      if (address) getBalance();
    }, 1000);


    return () => clearInterval(interval);

  } , [address, contract]);





  const [loadingAnimation, setLoadingAnimation] = useState(false);
  // loadingAnimation duration is 2 seconds
  // and then 10 seconds later it will be toggled again

  useEffect(() => {

    if (loadingAnimation) {
      setTimeout(() => {
        setLoadingAnimation(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setLoadingAnimation(true);
      }, 10000);
    }


    


  } , [loadingAnimation]);


  /*
  const { data: balanceData } = useReadContract({
    contract, 
    method: "function balanceOf(address account) view returns (uint256)", 

    params: [ address ], // the address to get the balance of

  });

  console.log(balanceData);

  useEffect(() => {
    if (balanceData) {
      setBalance(
        Number(balanceData) / 10 ** 6
      );
    }
  }, [balanceData]);


  console.log(balance);
  */






      

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {


    if (smartAccount) {

      //const phoneNumber = await getUserPhoneNumber({ client });
      //setPhoneNumber(phoneNumber);


      getUserPhoneNumber({ client }).then((phoneNumber) => {
        setPhoneNumber(phoneNumber || "");
      });



    }

  } , [smartAccount]);

 

  console.log(phoneNumber);




 

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("/profile-default.png");
  const [userCode, setUserCode] = useState("");


  const [seller, setSeller] = useState(null) as any;


  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {

      if (!address) {
          return;
      }

      
      const fetchData = async () => {

          const response = await fetch("/api/user/getUser", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  walletAddress: address,
              }),
          });

          const data = await response.json();

          //console.log("data", data);

          if (data.result) {
              setNickname(data.result.nickname);
              data.result.avatar && setAvatar(data.result.avatar);
              setUserCode(data.result.id);

              setSeller(data.result.seller);

          }

          setLoadingUser(false);
      };

      fetchData();

  }, [address]);



  const [countOfOpenOrders, setCountOfOpenOrders] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("/api/order/getCountOfOpenOrders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            }),
        });

        const data = await response.json();

        console.log("data", data);

        if (data.result) {

            setCountOfOpenOrders(data.result);
        }
    };

    fetchData();

  } , []);




  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("/api/user/getBestSellers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            }),
        });

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {

            setBestSellers(data.result.users);
        }
    };

    fetchData();

  }, []);  
  


  ///console.log("bestSellers", bestSellers);




  const [buyTrades, setBuyTrades] = useState([]);

  useEffect(() => {

    if (!address) {
      return;
    }

    const fetchData = async () => {
        const response = await fetch("/api/order/getBuyTradesProcessing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress: address,
              limit: 10,
              page: 1,
            }),
        });

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {

          setBuyTrades(data.result.orders);
        }
    };

    fetchData();

  } , [address]);





  const [sellTrades, setSellTrades] = useState([]);

  useEffect(() => {

    if (!address) {
      return;
    }

    const fetchData = async () => {
        const response = await fetch("/api/order/getSellTradesProcessing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress: address,
              limit: 10,
              page: 1,
            }),
        });

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {

          setSellTrades(data.result.orders);
        }
    };

    fetchData();

  } , [address]);




  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

      <div className="py-0 w-full">
        
        {/*
        <Header />
        */}

        <div className="w-full flex flex-col justify-between items-center gap-2 mb-5">



          <div className="flex flex-row justify-center items-center gap-2">
            <Image
              src="/logo-gpgpu.png"
              alt="GPGPU Wallet"
              width={500}
              height={100}
            />
          </div>

          <AppBarComponent />

          {/* select input for network selection (polygon, arbitrum) */}
          {/*
          <div className="flex flex-row gap-2 justify-center items-center">
            <button
              onClick={() => {
                // switch to polygon

                address && activeWallet?.disconnect();
                router.push(
                  "/" + params.lang + "/polygon"
                );
              }}
              className={`
                ${params.chain === "polygon" ? "bg-zinc-200 text-zinc-800" : "bg-zinc-800 text-zinc-300"} p-2 rounded`}
            >
              Polygon
            </button>
            <button
              onClick={() => {
                // switch to arbitrum
                address && activeWallet?.disconnect();
                router.push(
                  "/" + params.lang + "/arbitrum"
                );
              }}
              className={`
                ${params.chain === "arbitrum" ? "bg-zinc-200 text-zinc-800" : "bg-zinc-800 text-zinc-300"} p-2 rounded`}
            >
              Arbitrum
            </button>


          </div>
          */}

        </div>


  

        <div className="mt-4 w-full flex flex-col xl:flex-row justify-center gap-5 mb-10">




          {/*
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Next App",
              url: "https://gpgpu-wallet.vercel.app",
            }}
          />
          */}

          {/*
          <button
            onClick={() =>
              connect(async () => {

                
                const metamask = createWallet("io.metamask"); // pass the wallet id
      
                // if user has metamask installed, connect to it
                if (injectedProvider("io.metamask")) {
                  await metamask.connect({ client });
                }
      
                // open wallet connect modal so user can scan the QR code and connect
                else {
                  await metamask.connect({
                    client,
                    walletConnect: { showQrModal: true },
                  });
                }
      
                // return the wallet
                return metamask;


              })
            }
          >
            Connect
          </button>
          */}


        
            
              
              <div className="flex flex-col bg-zinc-800 p-5 rounded-lg text-center">


                <div className="flex flex-row justify-between items-center">

                  <div className="flex flex-row gap-2 justify-center items-center">
                    {/* Tether USDT logo */}
                    <Image
                      src="/logo-tether.png"
                      alt="USDT"
                      width={35}
                      height={35}
                      className="rounded-lg"
                    />
                    {/* button for polygon explorer */}
                    {address && !loadingAnimation
                      ? (
                        <button
                            onClick={() => {
                                window.open(`
                                  ${params.chain === "arbitrum" ? "https://arbiscan.io/address/" : "https://polygonscan.com/address/"}${address}
                                    `, "_blank");
                            }}
                            className="p-2 bg-zinc-200 text-zinc-800 rounded"
                        >
                            <Image
                                //src="/logo-polygon.png"

                                src={`/logo-${params.chain}.png`}
                                alt="Network"
                                width={18}
                                height={18}
                                
                            />
                        </button>
                    ) : (
                      <Image
                        //src="/logo-polygon.png"
                        src={`/logo-${params.chain}.png`}
                        alt="Network"
                        width={20}
                        height={20}
                        className='ml-2 animate-spin'
                      />
                  
                    )}
                      
                  </div>

                  {/* Settings Button */}
                  <button

                    onClick={() => {

                      if (!address) {
                        toast.error(Please_connect_your_wallet_first);
                        return;
                      }
                      // setup USDT
                      //console.log("settings");

                      // redirect to settings page
                      router.push(
                        "/" + params.lang + "/" + params.chain + "/settings"
                      );

                    }}
                    className="text-blue-500 hover:underline"
                  >
                    <GearSetupIcon />

                  </button>

                </div>

                <div className="mt-4 flex flex-row gap-2 justify-center items-center">
                  <div className="text-4xl font-semibold text-zinc-100">
                    {Number(balance).toFixed(2)}
                  </div>
                  <p className="text-sm text-zinc-300">USDT</p>
                </div>
                <p className="text-sm text-zinc-300">
                  {My_Balance}
                </p>


                {/* my address and copy button */}
                {/*
                <div className="flex flex-row justify-center items-center mt-4">

                  {address && (
                    <>
                      <p className="text-zinc-300 text-xs w-80">
                        {address}
                      </p>

                      <button

                        onClick={() => {
                          navigator.clipboard.writeText(address);
                          toast.success('Address copied to clipboard');
                        }}
                        className="text-sm text-blue-500 ml-2 hover:underline"
                      >
                        Copy
                      </button>
                    </>
                  )}

                </div>
                */}


                {/* send button */}
                <div className="flex flex-row gap-2 justify-center items-center mt-10">
                  <button
                    disabled={!address}
                    onClick={() => {
                      // send USDT
                      //console.log("send USDT");

                      if (!address) {
                        toast.error(Please_connect_your_wallet_first);
                        return;
                      }

                      // redirect to send USDT page
                      router.push(
                        "/" + params.lang + "/" + params.chain + "/send-usdt-favorite"
                      );

                    }}
                    className=" w-40 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {Send_USDT}
                  </button>

                    {/*
                  <button
                    
                    //disabled={!address}

                    onClick={() => {
                      // pay USDT
                      //console.log("pay USDT");

                      if (!address) {
                        toast.error(Please_connect_your_wallet_first);
                        return;
                      }


                      // redirect to send USDT page
                      //router.push("/send-usdt-favorite");

                      // comming soon

                      toast.success(Coming_Soon);

                      //router.push('/' + params.lang + '/' + params.chain + '/sell-usdt');


                    }}
                    className=" w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {Pay_USDT}
                  </button>
                  */}
                </div>

                {/* Go Buy USDT */}
                {/*
                <div className="flex flex-row justify-center items-center mt-4">
                  <button
                    onClick={() => {
  

                      // redirect to buy USDT page
                      router.push(
                        "/" + params.lang + "/" + params.chain + "/buy-usdt"
                      );

                    }}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {Buy_USDT}
                  </button>
                </div>
                */}




              </div>

              {/* My Nickname */}



              <div className="w-full flex flex-col bg-zinc-800 p-5 rounded-lg text-center">

                <div className="flex flex-row justify-between items-center">
                  <Image
                    src={avatar || "/profile-default.png"}
                    alt="Profile Image"
                    width={35}
                    height={35}
                    priority={true} // Added priority property
                    className="rounded-full"
                    style={{
                        objectFit: 'cover',
                        width: '35px',
                        height: '35px',
                    }}
                  />

                  {/* Settings Button */}
                  <button

                    onClick={() => {

                      if (!address) {
                        toast.error(Please_connect_your_wallet_first);
                        return;
                      }

                      // redirect to settings page
                      router.push("/" + params.lang + "/" + params.chain + "/profiles");


                    


                    }}
                    className="text-blue-500 hover:underline"
                  >
                    <GearSetupIcon />

                  </button>


                </div>
    
                {address && loadingUser ? (

                  <div className="mt-4 flex flex-row justify-center items-center">
                    <Image
                      src="/loading.png"
                      alt="Loading"
                      width={35}
                      height={35}
                      className="animate-spin"
                    />
                  </div>

                ) : (

                  <div className="mt-4 flex flex-row gap-2 justify-center items-center">
                    <h2 className="text-3xl font-semibold text-zinc-100">
                      {nickname}
                    </h2>
                    {userCode && (
                      <Image
                        src="/verified.png"
                        alt="Verified"
                        width={20}
                        height={20}
                        className="rounded-lg"
                      />
                    )}
                    {seller && (
                      <Image
                        src="/best-seller.png"
                        alt="Best Seller"
                        width={20}
                        height={20}
                        className="rounded-lg"
                      />
                    )}
                  </div>

                )}


                <p className="text-sm text-zinc-300">{My_Nickname}</p>


              
                <div className="flex flex-row gap-2 justify-center items-center mt-10">


                  {/* Go Buy USDT */}

                  <button
                    onClick={() => {
  

                      // redirect to buy USDT page
                      router.push(
                        "/" + params.lang + "/" + params.chain + "/buy-usdt"
                      );

                    }}
                    className=" w-40 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {Buy_USDT}
                  </button>
             


 
                  <button
                    disabled={!address}
                    onClick={() => {
                      // my sell trades
                      //console.log("my sell trades");
                      if (!address) {
                        toast.error(Please_connect_your_wallet_first);
                        return;
                      }

                      if (!seller && !userCode) {
                        toast.error(Please_verify_your_account_first_for_selling);
                        return;
                      }

                      // redirect to sell trades page
                      router.push(
                        "/" + params.lang + "/" + params.chain + "/sell-usdt"
                      );

                    }}
                    className="w-40 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {Sell_USDT}
                  </button>

                </div>
                


              </div>



          {!address && (

            <>

              {params.chain === "polygon" && (


                <ConnectButton

                  client={client}

                  wallets={wallets}
                  
                  accountAbstraction={{   
                    
                    chain: polygon,
                    //
                    //chain: polygon,

                    //chain: arbitrum,
                    factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
                    gasless: true,
                  }}
                  
                  theme={"light"}
                  connectModal={{
                    size: "wide",
                    
                    //title: "Connect",



                  }}


                  
                  appMetadata={
                    {
                      logoUrl: "https://gpgpu-wallet.vercel.app/logo-gpgpu.png",
                      name: "Next App",
                      url: "https://gpgpu-wallet.vercel.app",
                      description: "This is a Next App.",

                    }
                  }

                />

              )}



              {params.chain === "arbitrum" && (
                  
                  <ConnectButton
  
                    client={client}
  
                    wallets={wallets}
                    
                    accountAbstraction={{   
                      
                      chain: arbitrum,
                      //
                      //chain: polygon,
  
                      //chain: arbitrum,
                      factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
                      gasless: true,
                    }}
                    
                    theme={"light"}
                    connectModal={{
                      size: "wide",
                      
                      //title: "Connect",

                    }}

                    appMetadata={
                      {
                        logoUrl: "https://gpgpu-wallet.vercel.app/logo-gpgpu.png",
                        name: "Next App",
                        url: "https://gpgpu-wallet.vercel.app",
                        description: "This is a Next App.",
  
                      }
                    }

                  />

              )}


            </>

          )}


        </div>

        {/*}
        <div className="grid gap-4 lg:grid-cols-3 justify-center">

          <ArticleCard
            title={`${Buy_USDT} - ${Open_Orders} (${countOfOpenOrders}) EA`}
            
            href={`${params.lang}/buy-usdt`}

            description={Buy_Description}
          />

          
            
          <ArticleCard
            title={`${Sell_USDT} - ${Open_Orders} (${countOfOpenOrders}) EA`}
            href={`${params.lang}/sell-usdt`}
            description={Sell_Description}
          />
            


        </div>
        */}


        {/* Best Sellers */}
        {/*
        <div className="bg-zinc-800 p-5 rounded-lg text-center mt-10">
          <h2 className="text-3xl font-semibold text-zinc-100">
            Best Sellers
          </h2>
          <p className="text-zinc-300">Check out the best sellers</p>

          <div className="grid gap-4 lg:grid-cols-3 justify-center mt-4">


            {bestSellers.map((seller: any) => (
              <ArticleCard
                key={seller.id}
                title={seller.nickname}
                avatar={seller.avatar}
                href={`/buy-usdt`}
                description="Check out the best sellers"
              />
            ))}
 

          </div>
        </div>
        */}

      </div>

      

    </main>
  );
}



function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      {/*
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      
      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
      */}
    </header>
  );
}

function ThirdwebResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="thirdweb SDK Docs"
        href="https://portal.thirdweb.com/typescript/v5"
        description="thirdweb TypeScript SDK documentation"
      />

      <ArticleCard
        title="Components and Hooks"
        href="https://portal.thirdweb.com/typescript/v5/react"
        description="Learn about the thirdweb React components and hooks in thirdweb SDK"
      />

      <ArticleCard
        title="thirdweb Dashboard"
        href="https://thirdweb.com/dashboard"
        description="Deploy, configure, and manage your smart contracts from the dashboard."
      />
    </div>
  );
}


function MarketResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">

      <ArticleCard
        title="Buy USDT"
        href="/buy-usdt"
        description="Buy USDT with your favorite real-world currency"
      />

  
      <ArticleCard
        title="Sell USDT"
        href="/sell-usdt"
        description="Sell USDT for your favorite real-world currency"
      />

      <ArticleCard
        title="How to use USDT"
        href="/"
        description="Learn how to use USDT in your favorite DeFi apps"
      />

    </div>
  );
}





function ArticleCard(props: {
  avatar?: string;
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      
      //href={props.href + "?utm_source=next-template"}
      href={props.href}

      //target="_blank"

      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >

      <div className="flex justify-center">
        <Image
          src={props.avatar || thirdwebIcon}
          alt="avatar"
          width={38}
          height={38}
          priority={true} // Added priority property
          className="rounded-full"
          style={{
              objectFit: 'cover',
              width: '38px',
              height: '38px',
          }}
        />
      </div>

      <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    </a>
  );
}
