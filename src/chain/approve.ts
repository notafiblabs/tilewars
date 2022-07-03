import { BigNumber } from "ethers";
import { contracts, getAddress, subscribeToAccountChange } from "./chain";

let approved: boolean = false;
subscribeToAccountChange(() => approved = false);

export async function approveIfUnapproved(spender: string): Promise<boolean> {
    if(approved)
        return true;
    
    return approveLocal(spender);
}

async function approveLocal(spender: string): Promise<boolean> {
    let result: BigNumber = await contracts().approve.allowance(await getAddress(), spender);
    console.log('approve-result', result);
    if((result as BigNumber).isZero() == false)
    {
        let res: boolean = await contracts().approve.approve(spender, BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'));
        if(res == true) {
            approved = true;
            return true;
        }
    }
        
    return false;
}