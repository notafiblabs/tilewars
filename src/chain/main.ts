import { BigNumber } from "ethers";
import { ITile } from "../types";
import { approveIfUnapproved } from "./approve";
import { contracts, getAddress, mainAddress } from "./chain";

export const BurnAddress = '0x0000000000000000000000000000000000000000';

const refreshCallbacks: (() => void)[] = [];
export function subscribeToRefresh(callback: () => void) {
    refreshCallbacks.push(callback);
}

contracts().main.on('RefreshTile', () => {
    for(let callback of refreshCallbacks) {
        callback();
    }
});

export interface IBlockChainTile {
    owner: string;
    power: BigNumber;
    sellPrice: BigNumber;
    bounty: BigNumber;
}

export async function sellTile(index: number, sellPrice: BigNumber) {
    await approveIfUnapproved(mainAddress);
    let result = await contracts().main.sellTile(index, sellPrice);
    console.log(result);
}

export async function buyTile(index: number) {
    await approveIfUnapproved(mainAddress);
    let result = await contracts().main.buyTile(index);
    console.log(result);
}

export async function increasePower(index: number, amt: BigNumber) {
    await approveIfUnapproved(mainAddress);
    console.log(amt);

    let result = await contracts().main.increasePower(index, amt);
    console.log(result);
}

export async function challengeTile(indexAttacker: number, indexDefender: number) {
    await approveIfUnapproved(mainAddress);
    console.log(indexAttacker, indexDefender);
    let result = await contracts().main.challengeTile(indexAttacker, indexDefender);
    console.log(result);
}

export async function getAllTiles(): Promise<ITile[]> {
    let result = await contracts().main.getAllTiles();
    let bcTiles = result as IBlockChainTile[];
    let address = await getAddress();

    let tiles: ITile[] = bcTiles.map((bcTile, index) => {
        let color = parseInt(bcTile.owner.substring(0, 8));
        if(bcTile.owner == BurnAddress)
            color = 8421504; // gray

        return {
            index,
            owner: bcTile.owner,
            owned: bcTile.owner == address, 
            power: bcTile.power,
            price: bcTile.sellPrice,
            bounty: bcTile.bounty,
            color: {
                r: (color & 0xFF) + 25,
                g: ((color & 0xFF00) >> 8) + 25,
                b: ((color & 0xFF0000) >> 16) + 25
            }
        }
    });

    return tiles;
}