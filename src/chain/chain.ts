import { Contract, ethers } from "ethers"
import abi from './abi.json';

const contractAddress = '0x653324E7ad696D70c9aa590Ad657395D7DF3bf83';

export const provider = new ethers.providers.Web3Provider((window as any).web3.currentProvider);
provider.send("eth_requestAccounts", []);

export const signer = provider.getSigner(0);
export interface IContracts {
    main: Contract
}

export const contracts: IContracts = {
    main: new ethers.Contract(contractAddress, abi, signer)
}
