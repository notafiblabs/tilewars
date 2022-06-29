import { BigNumber } from "ethers";
import { ITile } from "../types";
import { contracts } from "./chain";

export const BurnAddress = '0x0000000000000000000000000000000000000000';

export interface IBlockChainTile {
    owner: string;
    power: BigNumber;
    sellPrice: BigNumber;
}

export async function sellTile(index: number, sellPrice: number) {
    let result = await contracts.main.sellTile(index, sellPrice);
    console.log(result);
}

export function buyTile(index: number) {

}

export function attackTile(indexAttacker: number, indexDefender: number) {

}

export async function getAllTiles(): Promise<ITile[]> {
    let result = await contracts.main.getAllTiles();
    let bcTiles = result as IBlockChainTile[];
    let tiles: ITile[] = bcTiles.map(bcTile => {
        let color = parseInt(bcTile.owner.substring(0, 8));
        if(bcTile.owner == BurnAddress)
            color = 8421504; // gray

        return {
            owner: bcTile.owner,
            power: bcTile.power,
            price: bcTile.sellPrice,
            color: {
                r: (color & 0xFF) + 25,
                g: ((color & 0xFF00) >> 8) + 25,
                b: ((color & 0xFF0000) >> 16) + 25
            }
        }
    });

    return tiles;
}

export function getTileAtIndex(index: number) {

}