import { BigNumber } from "ethers";

export interface ITile {
    owner: string;
    power: BigNumber;
    price: BigNumber;
    color: {
        r: number;
        g: number;
        b: number;
    }
}