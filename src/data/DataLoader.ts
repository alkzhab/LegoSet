import type { LegoSet } from "../models/LegoSet";

const themesMap = new Map<number, string>();

async function loadThemes(): Promise<void> {
    const response = await fetch('public/themes.csv');
    const text = await response.text();
    const lines = text.split('\n');

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const parts = line.split(',');
            const id = parseInt(parts[0]);
            const name = parts[1];
            themesMap.set(id, name);
        }
    }
}

function convertCSVLineToLegoSet(line: string): LegoSet | null {
    const parts = line.split(',');
    
    if (parts.length < 6) return null;

    const themeId = parseInt(parts[3]);

    return {
        reference: parts[0],
        name: parts[1],
        year: parseInt(parts[2]),
        theme_id: themeId,
        theme: themesMap.get(themeId) || "Unknown Theme",
        num_parts: parseInt(parts[4]),
        image_url: parts[5]
    };
}

export async function loadAllSets(): Promise<LegoSet[]> {
    await loadThemes();

    const response = await fetch('public/sets.csv');
    const text = await response.text();
    const lines = text.split('\n');
    const sets: LegoSet[] = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
            const set = convertCSVLineToLegoSet(lines[i]);
            if (set) {
                sets.push(set);
            }
        }
    }

    return sets;
}