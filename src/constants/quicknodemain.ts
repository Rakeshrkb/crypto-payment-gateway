// async function main(payload) {
//   const logs = payload.data;
//   const matchedEvents = [];

//   for (const log of logs) {
//     // 1. Check if it's an ERC20 Transfer event
//     if (log.topics && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
      
//       // 2. Extract 'to' address (Merchant) and the 'amount'
//       const toAddress = '0x' + log.topics[2].slice(26).toLowerCase();
//       const rawAmount = BigInt(log.data);

//       /**
//        * IMPORTANT: You must decide if your KV key stores the 
//        * RAW BigInt (e.g., 10010000) or the DECIMAL (e.g., 10.01).
//        * Let's assume you stored the RAW BigInt string as the key.
//        */
//       const amountKey = rawAmount.toString();
//       const compositeKey = `${toAddress}_${amountKey}`;

//       // 3. The "MATCHING" happens here:
//       // We check if this specific Merchant + Amount combination 
//       // exists in our 'active_merchant_payments' list.
//       const isMatch = await qnLib.qnContainsListItem('active_merchant_payments', compositeKey);

//       if (isMatch) {
//         matchedEvents.push({
//           txHash: log.transactionHash,
//           merchantAddress: toAddress,
//           rawAmount: amountKey,
//           tokenContract: log.address,
//           block: log.blockNumber
//         });
//       }
//     }
//   }

//   return matchedEvents.length > 0 ? matchedEvents : null;
// }