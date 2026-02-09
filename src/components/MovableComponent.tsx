import type { ReactElement } from 'react';
import './MovableComponent.css';

interface MovableComponentProps {
    children: ReactElement;
    first: boolean;
    last: boolean;
    onMove: (delta: number) => void;
}

export const MovableComponent = ({ children, first, last, onMove }: MovableComponentProps) => {
    return (
        <div className="movable-wrap">
            <div className="movable-inner">{children}</div>
            <div className="controls">
                {!first && (
                    <button className="ctrl-btn" onClick={() => onMove(-1)} title="Move Up">↑</button>
                )}
                {!last && (
                    <button className="ctrl-btn" onClick={() => onMove(1)} title="Move Down">↓</button>
                )}
            </div>
        </div>
    );
};