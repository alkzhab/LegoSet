import { useState, memo } from 'react';
import { createPortal } from 'react-dom';
import type { LegoSet } from '../models/LegoSet';
import './LegoSetDisplayer.css';

const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=No+Preview";

const LegoSetDisplayerComponent = ({ set, onChosenSet }: { set: LegoSet, onChosenSet?: (ls: LegoSet) => void }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const imageToDisplay = set.image_url || DEFAULT_IMAGE;

    return (
        <article className="card-wrapper">
            <div className="img-area" onClick={() => setIsZoomed(true)}>
                <img 
                    src={imageToDisplay} 
                    alt={set.name} 
                    className="set-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                />
            </div>

            <div className="info-area">
                <div className="set-meta">{set.theme}</div>
                
                <a 
                    href={`https://rebrickable.com/sets/${set.reference}/`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="set-title"
                >
                    {set.name}
                </a>

                <div className="badges">
                    <span className="badge">{set.year}</span>
                    <span className="badge accent">{set.num_parts} pcs</span>
                    <span className="badge" style={{ marginLeft: 'auto', fontFamily: 'monospace' }}>#{set.reference}</span>
                </div>

                {onChosenSet && (
                    <button className="action-btn" onClick={() => onChosenSet(set)}>
                        <span>+ Add to Collection</span>
                    </button>
                )}
            </div>

            {isZoomed && createPortal(
                <div 
                    onClick={() => setIsZoomed(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 9999,
                        backdropFilter: 'blur(8px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out'
                    }}
                >
                    <img src={imageToDisplay} alt={set.name} style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '12px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
                </div>,
                document.body
            )}
        </article>
    );
};

export const LegoSetDisplayer = memo(LegoSetDisplayerComponent);