import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import {AccountLayout, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { ENDPOINT, WALLET1 } from '../env';

const rpcEndpoint = ENDPOINT;
const solConn = new Connection(rpcEndpoint);


async function getTokenAccounts(wallet: string, conn: Connection) {
    const filters:GetProgramAccountsFilter[] = [
        {
            dataSize: 165,    //size of account (bytes)
        },
        {
            memcmp: {
                offset: 32,     //location of our query in the account (bytes)
                bytes: wallet,  //our search criteria, a base58 encoded string
            }
        }
    ];
    const accounts = await conn.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {filters}
    );
    accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        console.log(parsedAccountInfo);
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
    });
}

getTokenAccounts("2U9VpDBH4nZLAL8aWXHVFBjyp4RXdFgj828rAvHQMT8M", solConn);


