// "use client";

// import React from "react";

// import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// import { PublicKey, VersionedTransaction } from "@solana/web3.js";
// import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";

// import { SolAsset } from "@/lib/assets";
// import { useTxnToast } from "@/hooks/use-txn-toast";

// import { TokenInput } from "@/components/sol/token-input";

// import { Button } from "@/components/ui/button";

// type DemoSwapProps = {
//   tokens: PublicKey[];
// };

// const DemoSwap = ({ tokens }: DemoSwapProps) => {
//   const [tokenFrom, setTokenFrom] = React.useState<SolAsset | null>(null);
//   const [tokenTo, setTokenTo] = React.useState<SolAsset | null>(null);
//   const [amountFrom, setAmountFrom] = React.useState<number>(0);
//   const [amountTo, setAmountTo] = React.useState<number>(0);
//   const [isTransacting, setIsTransacting] = React.useState<boolean>(false);
//   const { publicKey, sendTransaction, wallet } = useWallet();
//   const { connection } = useConnection();
//   const { txnToast } = useTxnToast();

//   const handleSwap = React.useCallback(async () => {
//     if (isTransacting) {
//       return;
//     }

//     const signingToast = txnToast();

//     if (!wallet || !publicKey) {
//       signingToast.error("Wallet not connected.");
//       return;
//     }

//     if (!tokenFrom || !tokenTo || !amountFrom) {
//       signingToast.error("Missing required information for swap.");
//       return;
//     }

//     try {
//       setIsTransacting(true);
//       // Define the input and output mint addresses
//       const inputMint = tokenFrom.mint.toBase58();
//       const outputMint = tokenTo.mint.toBase58();

//       // Convert amountTo to the smallest unit (e.g., lamports for SOL)
//       const amount = amountFrom * Math.pow(10, tokenFrom.decimals);

//       // Fetch the quote from Jupiter API
//       const quoteResponse = await fetch(
//         `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`,
//       ).then((res) => res.json());

//       console.log("Quote Response:", quoteResponse);

//       const { swapTransaction } = await fetch(
//         "https://quote-api.jup.ag/v6/swap",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             quoteResponse,
//             userPublicKey: publicKey.toString(),
//             wrapAndUnwrapSol: true,
//           }),
//         },
//       ).then((res) => res.json());

//       // Deserialize the transaction
//       const transactionBuffer = Buffer.from(swapTransaction, "base64");
//       const transaction = VersionedTransaction.deserialize(transactionBuffer);

//       // Fetch latest blockhash for transaction
//       const latestBlockhash = await connection.getLatestBlockhash();
//       transaction.message.recentBlockhash = latestBlockhash.blockhash;

//       // Sign and send the transaction using wallet adapter
//       const signature = await sendTransaction(transaction, connection);

//       // Confirm the transaction using the updated confirmation method
//       const confirmation = connection.confirmTransaction(
//         {
//           signature,
//           blockhash: latestBlockhash.blockhash,
//           lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//         },
//         "finalized",
//       );

//       signingToast.confirm(signature, confirmation);

//       confirmation.then(() => {
//         console.log(
//           `Transaction confirmed: https://solscan.io/tx/${signature}`,
//         );
//       });
//     } catch (error) {
//       console.error("Error during swap:", error);
//       signingToast.error(
//         error instanceof Error ? error.message : "Something went wrong",
//       );
//     } finally {
//       setIsTransacting(false);
//     }
//   }, [
//     tokenFrom,
//     tokenTo,
//     amountFrom,
//     publicKey,
//     wallet,
//     connection,
//     sendTransaction,
//     isTransacting,
//     txnToast,
//   ]);

//   console.log(tokenFrom, tokenTo, amountFrom, amountTo);

//   return (
//     <div>
//       <div className="mb-12 space-y-3 text-center">
//         <h1 className="text-3xl">Swap Demo</h1>
//         <p className="text-muted-foreground">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
//           quos.
//         </p>
//       </div>
//       <div className="rounded-lg border p-4">
//         <div className="flex flex-col items-center justify-center gap-4">
//           <TokenInput
//             assets={tokens}
//             owner={publicKey}
//             onTokenSelect={setTokenFrom}
//             onAmountChange={setAmountFrom}
//           />
//           <div className="flex gap-2">
//             <IconArrowUp size={18} />
//             <IconArrowDown size={18} />
//           </div>
//           <TokenInput
//             assets={tokens}
//             owner={publicKey}
//             disabled={true}
//             showWalletBalance={false}
//             showQuickAmountButtons={false}
//             onTokenSelect={setTokenTo}
//             onAmountChange={setAmountTo}
//           />
//         </div>
//         <Button className="mt-4 w-full" onClick={handleSwap}>
//           Swap
//         </Button>
//       </div>
//     </div>
//   );
// };

// export { DemoSwap };
