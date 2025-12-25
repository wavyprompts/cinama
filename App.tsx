
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWatchListStore } from './store/useWatchListStore';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { Admin } from './pages/Admin';
import { DetailModal } from './components/DetailModal';
import { SearchResults } from './pages/SearchResults';

const App: React.FC = () => {
    const { items, addEntry, updateEntry, deleteEntry, importData, clearAll, isLoaded } = useWatchListStore();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedItem = items.find(i => i.id === selectedItemId) || null;

    if (!isLoaded) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 text-white overflow-hidden">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="font-title text-sm font-black uppercase tracking-[1em] opacity-30 animate-pulse">Initializing System</div>
        </div>
    );

    return (
        <HashRouter>
            <Layout items={items} onSelectItem={setSelectedItemId}>
                <Routes>
                    <Route path="/" element={<Home items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/search" element={<SearchResults items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/kdrama" element={<CategoryPage categoryIds={['kdrama']} title="K-Drama" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/kmovie" element={<CategoryPage categoryIds={['kmovie']} title="K-Movie" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/hdrama" element={<CategoryPage categoryIds={['hdrama']} title="Hollywood Series" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/hmovie" element={<CategoryPage categoryIds={['hmovie']} title="Hollywood Movies" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/bdrama" element={<CategoryPage categoryIds={['bdrama']} title="Bollywood Series" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/bmovie" element={<CategoryPage categoryIds={['bmovie']} title="Bollywood Movies" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/cdrama" element={<CategoryPage categoryIds={['cdrama']} title="C-Drama" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/anime" element={<CategoryPage categoryIds={['anime']} title="Anime" items={items} onInfo={setSelectedItemId} />} />
                    <Route path="/admin" element={
                        <Admin 
                            items={items} 
                            onAdd={addEntry} 
                            onUpdate={updateEntry} 
                            onDelete={deleteEntry} 
                            onImport={importData} 
                            onClearAll={clearAll} 
                        />
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <DetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItemId(null)} 
                    onEdit={(id) => { 
                        setSelectedItemId(null); 
                        window.location.hash = '#/admin'; 
                    }}
                    onDelete={(id) => { 
                        if (confirm(`Remove this record from registry?`)) {
                            deleteEntry(id); 
                            setSelectedItemId(null); 
                        }
                    }}
                />
            </Layout>
        </HashRouter>
    );
};

export default App;
