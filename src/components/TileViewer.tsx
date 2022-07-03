import { RefObject, useContext, useEffect, useState } from 'react';
import { challengeTile, BurnAddress, buyTile, getAllTiles, increasePower, sellTile } from '../chain/main';
import { getAddress, signer } from '../chain/chain';
import '../style/TileViewer.scss'
import { ITile } from '../types';
import { TileContext } from './TileContext';
import { BigNumber, ethers } from 'ethers';
import { ListTilePopup } from './ListTilePopup';
import { parseEther } from 'ethers/lib/utils';

export interface ITileViewerProps {
    zoom: number;
    setZoom: (setZoomCallback: (prevZoom: number) => number) => void;
}

function strFromAddress(tile: ITile, ownerOwnsTile: boolean): string {
    let tileOwnerStr: string;

    if (ownerOwnsTile)
        tileOwnerStr = 'You';
    else if(tile.owner == BurnAddress)
        tileOwnerStr = 'None';
    else 
        tileOwnerStr = tile.owner.substring(0, 6) + '...' + tile.owner.substring(38);

    return tileOwnerStr;
}

export const TileViewer = ({zoom, setZoom} : ITileViewerProps) => {
    const context = useContext(TileContext);

    const selectedTile: ITile = context.tileData.tiles[context.tileData.selectedTileIndex];
    const hoveredTile: ITile | null = context.tileData.hoveredTileIndex == null ? null :
        context.tileData.tiles[context.tileData.hoveredTileIndex];

    if(context.tileData.loading)
        return <></>

    const isListed: boolean = selectedTile.price.toString() != '0';
    const priceStr = isListed ? ethers.utils.formatEther(selectedTile.price): 'Unlisted';
    const ownerStr = strFromAddress(selectedTile, selectedTile.owned);

    return (
    <div className='tile-viewer'>
        <TileViewerTile tile={selectedTile}/>
        <div className='divider'/>

        <p><span className='label'>Owner:</span> <span>{ownerStr}</span></p>
        <p><span className='label'>Power:</span> <span>{ethers.utils.formatEther(selectedTile.power)}</span></p>
        <p>
            <span className='label'>Price: </span> 
            <span>{priceStr}</span>
            <span>{isListed && ' (FIB)'}</span>
        </p>

        <p>
            <span className='label'>Bounty: </span> 
            <span>{ethers.utils.formatEther(selectedTile.bounty)}</span>
            <span>{' (FIB)'}</span>
        </p>

        <div className='divider'/>
        
        <ChallengeButtons selectedTileIndex={selectedTile.index}/>
        <ButtonInputPair action={(amt) => increasePower(selectedTile.index, parseEther(amt))} buttonText="Increase Power"/>
        <PurchaseButton isListed={isListed} ownerOwnsTile={selectedTile.owned}
                selectedTileIndex={selectedTile.index}/>

        <div className='divider'/>

        <div className='zoom-container'>
            <label>Zoom: </label>
            <input type="range" value={zoom} min={0} max={400} 
                onChange={(e) => setZoom(zoom => parseFloat(e.target.value))}/>
        </div>

    </div>);
}

interface IButtonInputPairProps {
    action: (amt: string) => void;
    buttonText: string;
}

const ButtonInputPair = ({action, buttonText}: IButtonInputPairProps) => {
    const [amt, setAmt] = useState<string>('1');

    return (
    <div className='ButtonInputPair'>
        <input type="number" value={amt.toString()}
            onChange={(e) => setAmt(e.target.value)}></input>
        <button onClick={() => {action(amt)}}>{buttonText}</button>
    </div>);
}

interface ITileViewerTileProps {
    tile: ITile | null;
}

const TileViewerTile = ({tile}: ITileViewerTileProps) => {
    let colorStr = 'transparent';
    if(tile != null)    
        colorStr = `rgb(${tile.color.r}, ${tile.color.g}, ${tile.color.b})`;
    
        return (
        <div className="TileViewerTile" style={{
            backgroundColor: colorStr
        }}>
            
        </div>
    );
}

interface IPurchaseButtonProps {
    ownerOwnsTile: boolean;
    isListed: boolean;
    selectedTileIndex: number;
}

const PurchaseButton = (props: IPurchaseButtonProps) => {

    return (
    <>
        {(props.ownerOwnsTile ? (
        <>
            <ButtonInputPair action={(amt) => {
                sellTile(props.selectedTileIndex, parseEther(amt));
            }} buttonText = {props.isListed ? 'Relist' : 'List'}/>


            {props.isListed && <button onClick={() => {
                sellTile(props.selectedTileIndex, BigNumber.from(0));
            }}>Unlist</button>}
        </>) : (
        <>
            {props.isListed && (<button className="PurchaseButton" onClick={() => {
                buyTile(props.selectedTileIndex)}
            }>Purchase</button>)}
        </>))}
    </>)
}

interface IAdjacentObj {
    edgeTile: boolean;
    leftIndex: number;
    topIndex: number;
    bottomIndex: number;
    rightIndex: number;
}

function calcAdjacent(index: number): IAdjacentObj {
    let adjacent: IAdjacentObj = {edgeTile: false, leftIndex: -1, topIndex: -1,
         bottomIndex: -1, rightIndex: -1}

    adjacent.leftIndex = index - 1;
    adjacent.rightIndex = index + 1;
    adjacent.topIndex = index - 20;
    adjacent.bottomIndex = index + 20;

    if(index < 20) {
        adjacent.topIndex = -1;
        adjacent.edgeTile = true;
    }
    if(index >= 380) {
        adjacent.bottomIndex = -1;
        adjacent.edgeTile = true;
    }
    if(index % 20 == 0) {
        adjacent.leftIndex = -1;
        adjacent.edgeTile = true;
    }
    if(index % 20 == 19) {
        adjacent.rightIndex = -1;
        adjacent.edgeTile = true;
    }

    return adjacent;    
}

interface IChallengeButtonsProps {
    selectedTileIndex: number;
}

const ChallengeButtons = (props: IChallengeButtonsProps) => {
    let context = useContext(TileContext);
    let adjacent = calcAdjacent(props.selectedTileIndex);

    function canChallenge(index: number): boolean {
        if(index == -1)
            return false;
        if(context.tileData.tiles[index].owned)
            return true;
        
        return false;
    }

    if(context.tileData.tiles[props.selectedTileIndex].owned == true)
        return <></>

    return <>
        {/*(canChallenge(adjacent.leftIndex) || canChallenge(adjacent.rightIndex) || 
            canChallenge(adjacent.topIndex) || canChallenge(adjacent.bottomIndex) ||
            adjacent.edgeTile) && <div className='divider'/>*/}

        {canChallenge(adjacent.leftIndex) && <button onClick={() => {
            challengeTile(adjacent.leftIndex, props.selectedTileIndex);
        }}>Challenge From Left</button>}

        {canChallenge(adjacent.rightIndex) && <button onClick={() => {
            challengeTile(adjacent.rightIndex, props.selectedTileIndex);
        }}>Challenge From Right</button>}  
        
        {canChallenge(adjacent.topIndex) && <button onClick={() => {
            challengeTile(adjacent.topIndex, props.selectedTileIndex);
        }}>Challenge From Above</button>}  
        
        {canChallenge(adjacent.bottomIndex) && <button onClick={() => {
            challengeTile(adjacent.bottomIndex, props.selectedTileIndex);
        }}>Challenge From Below</button>}     
        {adjacent.edgeTile && <ButtonInputPair buttonText='Enter' action={() => {}}/>}
    </>
}