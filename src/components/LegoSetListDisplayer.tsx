import type { LegoSet } from '../models/LegoSet';
import { LegoSetDisplayer } from './LegoSetDisplayer';
import { MovableComponent } from './MovableComponent';

interface LegoSetListDisplayerProps {
    sets: LegoSet[];
    onChosenSet?: (ls: LegoSet) => void;
    onMove?: (index: number, delta: number) => void;
}

export const LegoSetListDisplayer = (props: LegoSetListDisplayerProps) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            padding: '20px 0'
        }}>
            {props.sets.map((lego, index) => {
                const displayer = (
                    <LegoSetDisplayer 
                        key={lego.reference} 
                        set={lego} 
                        onChosenSet={props.onChosenSet} 
                    />
                );

                if (props.onMove) {
                    return (
                        <MovableComponent
                            key={lego.reference}
                            first={index === 0}
                            last={index === props.sets.length - 1}
                            onMove={(delta) => props.onMove!(index, delta)}
                        >
                            {displayer}
                        </MovableComponent>
                    );
                }
                return <div key={lego.reference}>{displayer}</div>;
            })}
        </div>
    );
};