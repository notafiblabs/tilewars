import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { sellTile } from '../chain/main';
import '../style/ListTilePopup.scss';

export interface IListTilePopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedTileIndex: number;
}

export const ListTilePopup = ({open, setOpen, selectedTileIndex}: IListTilePopupProps) => {
    let [price, setPrice] = useState<number | undefined>(undefined);
    useEffect(() => {
        if(open)
            (document.querySelector('#price-popup-input') as HTMLInputElement).focus();
        setPrice(undefined);
    }, [open]);

    if (open == false)
        return <></> 
    
    function close() {
        setOpen(false);
    }

    return createPortal(
    <>
        <div className='popup-background' onClick={() => close()}></div>
        <form className="ListTilePopup" onSubmit={(e) => {
            e.preventDefault();
            close();
            //if(price != undefined)
            //    sellTile(selectedTileIndex, price);
        }}>
            <h1>List Tile</h1>
            <div>
                <label>Price (FIB): </label>
                <input id='price-popup-input' type='number' name='price' value={price} 
                    min={1} step={500} placeholder="30000" onChange={(e) => {
                        setPrice(parseFloat(e.target.value));
                    }}></input>
            </div>
            <div>
                <button type='button' onClick={() => close()}>Cancel</button>
                <button type='submit'>Ok</button>
            </div>
        </form>
    </>, document.getElementById('popup')!);
}