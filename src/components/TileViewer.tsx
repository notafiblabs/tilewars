import { RefObject, useContext } from 'react';
import { getAllTiles, sellTile } from '../chain/main';
import '../style/TileViewer.scss'
import { ITile } from '../types';
import { TileContext } from './TileContext';

export interface ITileViewerProps {
    zoom: number;
    setZoom: (setZoomCallback: (prevZoom: number) => number) => void;
}

export const TileViewer = ({zoom, setZoom} : ITileViewerProps) => {
    const context = useContext(TileContext);
    const selectedTile: ITile | null = context.tileData.selectedTileIndex == null ? null :
        context.tileData.tiles[context.tileData.selectedTileIndex];
    const hoveredTile: ITile | null = context.tileData.hoveredTileIndex == null ? null :
        context.tileData.tiles[context.tileData.hoveredTileIndex];

    return (
    <div className='tile-viewer'>
        <p><span className='label'>owner:</span> <span>{selectedTile?.owner}</span></p>
        <p><span className='label'>power:</span> <span>{selectedTile?.power.toString()}</span></p>
        <p><span className='label'>price:</span> <span>{selectedTile?.price.toString()}</span></p>

        <div className='divider'/>

        <button onClick={async () => console.log(await getAllTiles())}>purchase</button>
        <button>challenge</button>
        <button onClick={() => sellTile(0, 20)}>sell</button>

        <div className='divider'/>

        <div className='zoom-container'>
            <label>Zoom: </label>
            <input type="range" value={zoom} min={0} max={400} 
                onChange={(e) => setZoom(zoom => parseFloat(e.target.value))}/>
        </div>

    </div>);
}

const TileViewerTile = () => {
    return (
        <div>

        </div>
    );
}