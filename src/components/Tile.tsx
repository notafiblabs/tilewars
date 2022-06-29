import { useContext, useState } from "react";
import '../style/Tile.scss'
import { TileContext } from "./TileContext";

export interface ITileProps {
    index: number;
}

export const Tile = ({index} : ITileProps) => {
    const context = useContext(TileContext);
    const tile = context.tileData.tiles[index];
    const selected = context.tileData.selectedTileIndex == index;

    return (
        <div className={`tile ${selected && 'selected'}`}
            onMouseEnter={(e) => context.setTileData((state) => {
                return {...state, hoveredTileIndex: index};
            })}
            onClick={(e) => context.setTileData((state) => {
                return {...state, selectedTileIndex: index}
            })}
            onDragStart={(e) => e.preventDefault()}
            style={{
                backgroundColor: `rgb(${tile.color.r}, ${tile.color.g}, ${tile.color.b})`
            }}>
        </div>
    )
}