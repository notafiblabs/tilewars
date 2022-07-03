import React, { PropsWithChildren, useEffect, useState } from 'react';
import { getAllTiles, subscribeToRefresh } from '../chain/main';
import { ITile } from '../types';

export interface ITileData {
    tiles: ITile[];
    selectedTileIndex: number;
    hoveredTileIndex: number | null;
    loading: boolean;
}

export interface ITileContext {
    tileData: ITileData;
    setTileData: (stateCallback: (state: ITileData) => ITileData) => void;
}

export const TileContext = React.createContext<ITileContext>({
    tileData: {
        tiles: [],
        selectedTileIndex: 0,
        hoveredTileIndex: null,
        loading: true
    },
    setTileData: () => {}
});

export const TileContextProvider = ({children}: PropsWithChildren) => {
    let [state, setState] = useState<ITileData>({
        selectedTileIndex: 0,
        hoveredTileIndex: null,
        tiles: [],
        loading: true
    });

    useEffect(() => {
        load();
        
        subscribeToRefresh(() => {
            load();
        });
    }, []);

    function load() {
        getAllTiles().then(tiles => {
            setState(state => {
                return {...state, tiles, loading: false};
            });
        });
    }

    return (
    <TileContext.Provider value={{
        tileData: state,
        setTileData: setState
    }}>
        {children}
    </TileContext.Provider>);
}


