
import { useState, useEffect } from 'react';
import { WatchItem, Category } from '../types';
import { INITIAL_DATA } from '../constants';

export const useWatchListStore = () => {
    const [items, setItems] = useState<WatchItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('thewatchlist_data');
        if (stored) {
            try {
                const parsedItems = JSON.parse(stored);
                // Migration logic: ensure lastUpdated exists
                const migratedItems = parsedItems.map((item: any) => ({
                    ...item,
                    lastUpdated: item.lastUpdated || item.dateAdded || new Date().toISOString().split('T')[0]
                }));
                setItems(migratedItems);
            } catch (e) {
                console.error("Failed to parse stored data", e);
                setItems(INITIAL_DATA);
            }
        } else {
            setItems(INITIAL_DATA);
            localStorage.setItem('thewatchlist_data', JSON.stringify(INITIAL_DATA));
        }
        setIsLoaded(true);
    }, []);

    const saveItems = (newItems: WatchItem[]) => {
        setItems(newItems);
        localStorage.setItem('thewatchlist_data', JSON.stringify(newItems));
    };

    const addEntry = (entry: Omit<WatchItem, 'id' | 'dateAdded' | 'lastUpdated'>) => {
        const idMap: Record<Category, string> = {
            kdrama: 'kd', kmovie: 'km', hdrama: 'hd', hmovie: 'hm',
            bdrama: 'bd', bmovie: 'bm', cdrama: 'cd', anime: 'ani'
        };
        const prefix = idMap[entry.category];
        const categoryItems = items.filter(i => i.category === entry.category);
        const nextNum = categoryItems.length + 1;
        const id = `${prefix}${nextNum.toString().padStart(3, '0')}`;
        
        const now = new Date().toISOString().split('T')[0];

        const newItem: WatchItem = {
            ...entry,
            id,
            dateAdded: now,
            lastUpdated: now
        };
        
        saveItems([newItem, ...items]);
    };

    const updateEntry = (id: string, updatedData: Partial<WatchItem>) => {
        const now = new Date().toISOString().split('T')[0];
        const newItems = items.map(item => item.id === id ? { 
            ...item, 
            ...updatedData,
            lastUpdated: now 
        } : item);
        saveItems(newItems);
    };

    const deleteEntry = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        saveItems(newItems);
    };

    const importData = (data: WatchItem[]) => {
        saveItems(data);
    };

    const clearAll = () => {
        saveItems([]);
    };

    return { items, addEntry, updateEntry, deleteEntry, importData, clearAll, isLoaded };
};
