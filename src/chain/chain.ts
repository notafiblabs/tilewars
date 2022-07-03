import { BigNumber, Contract, ethers } from "ethers"
import abi from './abi.json';
import approveAbi from './approve-abi.json';

export const mainAddress = '0x0D20bFb8daD8AA70AA0d7Ea73d95b79e641587Ed';
const approveAddress = '0xa36085F69e2889c224210F603D836748e7dC0088';

export const provider = new ethers.providers.Web3Provider((window as any).ethereum);
export let signer = provider.getSigner(0);

const callbackList: (() => void)[] = [];
export function subscribeToAccountChange(callback: () => void) {
    callbackList.push(callback);
}

provider.send("eth_requestAccounts", []);
provider.on('accountsChanged', () => {
    console.log(callbackList);
    for(let callback of callbackList) {
        callback();
    } 
});

export function getAddress(): Promise<string> {
    return signer.getAddress();
}

export interface IContracts {
    main: Contract;
    approve: Contract;
}

export function contracts() {
    return {
        main: new ethers.Contract(mainAddress, abi, signer),
        approve: new ethers.Contract(approveAddress, approveAbi, signer)
    };
}