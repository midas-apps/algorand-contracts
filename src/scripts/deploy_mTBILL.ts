import algosdk from "algosdk";
import { getAlgodClient, getLocalAccounts } from "../utils";

async function main() {
  const algodClient = getAlgodClient();
  const accounts = await getLocalAccounts();
  const creator = accounts[0];

  // example: ASSET_CREATE
  const suggestedParams = await algodClient.getTransactionParams().do();
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    sender: creator.addr,
    suggestedParams,
    defaultFrozen: false,
    unitName: "mTBILL",
    assetName: "Midas US Treasury Bill Token",
    manager: creator.addr,
    reserve: creator.addr,
    freeze: creator.addr,
    clawback: creator.addr,
    assetURL:
      "ipfs://bafkreihqauy6okluvepzioxdcj346jcic6gcpjb3qimv7d7ukgb4pdwz4m",
    total: 1_000_000n * 10n ** 9n,
    decimals: 9,
  });

  const signedTxn = txn.signTxn(creator.privateKey);
  await algodClient.sendRawTransaction(signedTxn).do();
  const result = await algosdk.waitForConfirmation(
    algodClient,
    txn.txID().toString(),
    3,
  );

  const assetIndex = result["assetIndex"];
  console.log(`Asset ID created: ${assetIndex}`);
  // example: ASSET_CREATE

  // example: ASSET_INFO
  const assetInfo = await algodClient.getAssetByID(assetIndex!).do();
  console.log(`Asset Name: ${assetInfo.params.name}`);
  console.log(`Asset Params: ${assetInfo.params}`);
}

main();
