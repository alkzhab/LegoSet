import { useEffect, useState, useMemo } from 'react';
import type { LegoSet } from '../models/LegoSet';
import { LegoSetListDisplayer } from './LegoSetListDisplayer';
import './LegoSetSearcher.css';

type SortKey = 'year' | 'name' | 'num_parts';
type SortOrder = 'asc' | 'desc';
interface SortConfig { key: SortKey; order: SortOrder; }

export const LegoSetSearcher = (props: { sets: LegoSet[], onChosenSet: (ls: LegoSet) => void }) => {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'year', order: 'desc' });

    useEffect(() => {
        const timerId = setTimeout(() => setDebouncedSearchText(searchText), 300);
        return () => clearTimeout(timerId);
    }, [searchText]);

    const filteredAndSortedSets = useMemo(() => {
        let result = props.sets;
        const text = debouncedSearchText.trim().toLowerCase();
        
        if (text !== "") {
            const isYearSearch = /^(19|20)\d{2}$/.test(text);
            if (isYearSearch) {
                const yearToFind = parseInt(text, 10);
                result = result.filter(set => set.year === yearToFind);
            } else {
                result = result.filter(set => 
                    set.name.toLowerCase().includes(text) || 
                    set.theme.toLowerCase().includes(text)
                );
            }
        }

        result = [...result].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;
            return 0;
        });

        return result.slice(0, 100);
    }, [props.sets, debouncedSearchText, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            order: current.key === key && current.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div>
            <div className="sticky-wrapper">
                <div className="search-glass-panel">
                    <div className="input-group">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            className="main-input"
                            placeholder="Search sets (e.g., Star Wars, 2023)..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    
                    <div className="filters-row">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>Sort by:</span>
                        <button className={`filter-chip ${sortConfig.key === 'year' ? 'active' : ''}`} onClick={() => handleSort('year')}>
                            Year
                        </button>
                        <button className={`filter-chip ${sortConfig.key === 'name' ? 'active' : ''}`} onClick={() => handleSort('name')}>
                            Name
                        </button>
                        <button className={`filter-chip ${sortConfig.key === 'num_parts' ? 'active' : ''}`} onClick={() => handleSort('num_parts')}>
                            Parts
                        </button>
                        
                        <div className="results-count">
                            {filteredAndSortedSets.length} results
                        </div>
                    </div>
                </div>
            </div>

            <LegoSetListDisplayer sets={filteredAndSortedSets} onChosenSet={props.onChosenSet} />
        </div>
    );
};