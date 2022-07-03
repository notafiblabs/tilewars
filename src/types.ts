import { BigNumber } from "ethers";

export interface ITile {
    owner: string;
    owned: boolean;
    power: BigNumber;
    price: BigNumber;
    bounty: BigNumber;
    index: number;
    color: {
        r: number;
        g: number;
        b: number;
    }
}