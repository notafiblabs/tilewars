import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import '../style/TileContainer.scss'
import { Tile } from './Tile';
import { TileContext } from './TileContext';

const padding = 20;

function frRepeat(count: number): string {
    let str = '';
    for(let i = 0; i < count; i++)
        str += '1fr ';

    return str;
}

export interface ITileContainerProps {
    rows: number;
    cols: number;
    zoom: number;
    setZoom: (setZoomCallback: (prevZoom: number) => number) => void;
}

export interface ITileContainerState {
    paddingY: number;
    paddingX: number;
}

export const TileContainer = (props: ITileContainerProps) => {
    let context = useContext(TileContext);
    
    if(context.tileData.loading)
        return <h1>Loading</h1>

    return <LoadedTileContainer {...props}/>
}

class LoadedTileContainer extends React.Component<ITileContainerProps, ITileContainerState> {

    public state: ITileContainerState;
    private mouseDown: boolean;
    private ref: React.RefObject<HTMLDivElement>;
    private containerRef: React.RefObject<HTMLDivElement>;
    private left: number;
    private top: number;
    private previousTouch: {x: number, y: number} | null;

    public constructor(props: ITileContainerProps) {
        super(props);

        this.state = {
            paddingY: 0,
            paddingX: 0
        };

        this.left = 0;
        this.top = 0;

        this.ref = React.createRef();
        this.containerRef = React.createRef();
        this.mouseDown = false;

        this.previousTouch = null;
    }

    componentDidMount() {
        this.ref.current!.onmousemove = (e) => {
            if(this.mouseDown == false)
                return;

            this.updateTranslation(this.left + e.movementX, this.top + e.movementY);
        };

        this.ref.current!.ontouchmove = (e) => {

            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            if(this.previousTouch == null) {
                this.previousTouch = {x: x, y: y};
            }

            const xDif = this.previousTouch.x - x;
            const yDif = this.previousTouch.y - y;

            this.updateTranslation(this.left - xDif * 1.25, this.top - yDif * 1.25);
            this.previousTouch = {x: x, y: y};
            e.preventDefault();
        }

        window.addEventListener('resize', this.updatePadding);
        this.updatePadding();

        document.body.addEventListener('pointerup', this.mouseUp);
    }

    componentWillUnmount() {
        this.ref.current!.onmousemove = null;
        document.body.removeEventListener('pointerup', this.mouseUp);
    }

    componentDidUpdate() {
        this.updateTranslation(this.left, this.top); // because translation independent of state
    }

    updatePadding = () => {
        const containerRect = this.containerRef.current!.getBoundingClientRect();
        const aspect = this.props.cols / this.props.rows;
        let paddingX = 0;
        let paddingY = 0;
        const realPadding = padding;


        if(containerRect.width < containerRect.height * aspect) {
            paddingY = (containerRect.height - (containerRect.width - realPadding * 2) / aspect) / 2;
            paddingX = realPadding;
        }
        else {
            paddingX = (containerRect.width - (containerRect.height - realPadding * 2) * aspect)  / 2;
            paddingY = realPadding;
        }

        this.setState(state => {
            return {...state, paddingY, paddingX}  
        });
    }

    updateTranslation(left: number, top: number): void {
        if(this.ref.current == null || this.containerRef.current == null)
            return;

        this.left = left;
        this.top = top;
        
        if(this.left > 0)
        this.left = 0;
    
        if(this.top > 0)
            this.top = 0;

        const boundingRect = this.ref.current!.getBoundingClientRect();
        const containerRect = this.containerRef.current!.getBoundingClientRect();

        if(boundingRect.width + this.left < containerRect.width - this.state.paddingX * 2)
            this.left = containerRect.width - boundingRect.width - this.state.paddingX * 2;
        
        if(boundingRect.height + this.top < containerRect.height - this.state.paddingY * 2)
            this.top = containerRect.height - boundingRect.height - this.state.paddingY * 2;            

        this.ref.current!.style.transform = `translate(${this.left}px, ${this.top}px)`
    }

    mouseUp = () => {
        this.mouseDown = false;
        this.previousTouch = null;
        console.log('up');
    }

    wheelHandler = (event: React.WheelEvent) => {
        let zoomAmt = -event.deltaY / 10;
        if(this.props.zoom + zoomAmt < 0)
            zoomAmt = 0;

        this.props.setZoom(zoom => zoom + zoomAmt);
    }

    render(): React.ReactNode {
        return (
        <div className='TileContainer'>
            <div className='tile-grid-container' ref={this.containerRef} style={{
                paddingTop: this.state.paddingY,
                paddingBottom: this.state.paddingY,
                paddingLeft: this.state.paddingX,
                paddingRight: this.state.paddingX
                }}>    
                    <div className="tile-grid" ref={this.ref}
                        onWheel={this.wheelHandler}
                        onPointerDown={() => {this.mouseDown = true; console.log('down')}}
                        style={{
                            gridTemplateRows: frRepeat(this.props.rows),
                            gridTemplateColumns: frRepeat(this.props.cols),
                            width: (100 + this.props.zoom) + '%',
                            height: (100 + this.props.zoom) + '%',
                        }}>
                        <TileList />
                    </div>
            </div>
        </div>);
    }

}

const TileList = () => {
    const context = useContext(TileContext);

    return ( 
    <>
        {context.tileData.tiles.map((value, index) => <Tile key={index} index={index}/>)}
    </>)
}

