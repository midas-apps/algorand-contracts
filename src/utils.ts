import algosdk, { Address } from "algosdk";
import dotenv from "dotenv";
dotenv.config();

export function getAlgodClient() {
  const algodToken = process.env.ALGOD_TOKEN ?? "a".repeat(64);
  const algodServer = process.env.ALGOD_SERVER ?? "http://localhost";
  const algodPort = process.env.ALGOD_PORT ?? "4001";

  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  return algodClient;
}

export interface SandboxAccount {
  addr: Address;
  privateKey: Uint8Array;
  signer: algosdk.TransactionSigner;
}

export async function getLocalAccounts(): Promise<SandboxAccount[]> {
  const mnemonic = process.env.MNEMONIC!;

  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const signer = algosdk.makeBasicAccountTransactionSigner(account);

  return [
    {
      addr: account.addr,
      signer,
      privateKey: account.sk,
    },
  ];
}
