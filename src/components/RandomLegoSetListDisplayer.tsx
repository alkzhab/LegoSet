import { useEffect, useState } from 'react';
import type { LegoSet } from '../models/LegoSet';
import { loadAllSets } from '../data/DataLoader';
import { LegoSetListDisplayer } from './LegoSetListDisplayer';

export const RandomLegoSetListDisplayer = (props: { n: number }) => {
    const [legoSets, setLegoSets] = useState<LegoSet[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAllSets().then((allSets) => {
            const shuffled = allSets.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, props.n);
            
            setLegoSets(selected);
            setIsLoading(false);
        }).catch(err => {
            console.error("Erreur de chargement:", err);
            setIsLoading(false);
        });
    }, [props.n]);

    if (isLoading || legoSets === undefined) {
        return <div style={{textAlign: 'center', padding: '20px'}}>Chargement des briques en cours... </div>;
    }

    return (
        <div>
            <h2 style={{textAlign: 'center'}}>{props.n} Sets Aléatoires</h2>
            <LegoSetListDisplayer sets={legoSets} />
        </div>
    );
};