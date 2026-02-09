import { useEffect, useState } from 'react';
import type { LegoSet } from '../models/LegoSet';
import { loadAllSets } from '../data/DataLoader';
import { LegoSetListDisplayer } from './LegoSetListDisplayer';
import { LegoSetSearcher } from './LegoSetSearcher';
import usePersistentState from '../hooks/usePersistentState';

export const LegoSetListManager = () => {
    const [allSets, setAllSets] = useState<LegoSet[]>([]);
    const [favoriteSets, setFavoriteSets] = usePersistentState<LegoSet[]>("lego-favs-v2", []);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAllSets().then((sets) => {
            setAllSets(sets);
            setIsLoading(false);
        });
    }, []);

    const handleMoveSet = (index: number, delta: number) => {
        const newFavorites = [...favoriteSets];
        const targetIndex = index + delta;
        if (targetIndex < 0 || targetIndex >= newFavorites.length) return;
        [newFavorites[index], newFavorites[targetIndex]] = [newFavorites[targetIndex], newFavorites[index]];
        setFavoriteSets(newFavorites);
    };

    const handleAddSet = (setToAdd: LegoSet) => {
        if (favoriteSets.some(s => s.reference === setToAdd.reference)) {
            alert(`${setToAdd.name} is already in your collection!`);
            return;
        }
        setFavoriteSets(prev => [...prev, setToAdd]);
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading Bricks...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
            <header style={{ padding: '80px 0 60px', textAlign: 'center' }}>
                <h1 style={{ 
                    fontSize: '4rem', 
                    letterSpacing: '-0.03em',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #fff 30%, var(--text-muted))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Lego<span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial' }}>.</span>Manager
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Curate your ultimate brick collection. Search, add, and organize.
                </p>
            </header>

            <section style={{ marginBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '1.75rem' }}>My Collection</h2>
                    <span style={{ 
                        background: 'rgba(99, 102, 241, 0.15)', 
                        color: 'var(--primary)', 
                        padding: '6px 16px', 
                        borderRadius: '20px', 
                        fontSize: '0.875rem', 
                        fontWeight: 600,
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                        {favoriteSets.length} Sets
                    </span>
                </div>

                {favoriteSets.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '80px 20px', 
                        border: '2px dashed rgba(255,255,255,0.1)', 
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>📦</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Your collection is empty</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Start by searching for your favorite sets below.</p>
                    </div>
                ) : (
                    <LegoSetListDisplayer sets={favoriteSets} onMove={handleMoveSet} />
                )}
            </section>

            <section>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '32px', textAlign: 'center' }}>Explore Catalog</h2>
                <LegoSetSearcher sets={allSets} onChosenSet={handleAddSet} />
            </section>
        </div>
    );
};