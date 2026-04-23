import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import GraphView from '../components/GraphView';
import { useNotes } from '../hooks/useNotes';
import { buildGraphData } from '../utils/linkParser';
import { buildHybridGraphData } from '../utils/semanticSimilarity';
import { createNote } from '../store';
import type { Note } from '../types';
import { headerConfig, graphConfig } from '../config';

export default function Notes() {
  const navigate = useNavigate();
  const { notes, isLoading, createNote: createNoteInDb, updateNote, deleteNote, deleteManyNotes } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'editor' | 'graph'>('editor');
  const [semanticThreshold, setSemanticThreshold] = useState(20); // 20% minimum

  const selectedNote = useMemo(() => notes.find((n) => n.id === selectedId) || null, [notes, selectedId]);

  // Build graph nodes and hybrid edges
  const graphData = useMemo(() => buildGraphData(notes), [notes]);
  
  const { wikiEdges, semanticEdges } = useMemo(() => {
    return buildHybridGraphData(notes, graphData.edges, semanticThreshold / 100);
  }, [notes, graphData.edges, semanticThreshold]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setView('editor');
  }, []);

  const handleNavigate = useCallback((title: string) => {
    const target = notes.find((n) => n.title.toLowerCase() === title.toLowerCase());
    if (target) {
      setSelectedId(target.id);
      setView('editor');
    }
  }, [notes]);

  const handleNew = useCallback(async () => {
    const newNote = createNote('Yeni Not', '');
    try {
      const created = await createNoteInDb(newNote.title, newNote.content);
      setSelectedId(created.id);
      setView('editor');
    } catch {
      // Error handled by hook
    }
  }, [createNoteInDb]);

  const handleUpdate = useCallback((id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
  }, [updateNote]);

  const handleDelete = useCallback((id: string) => {
    deleteNote(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [deleteNote, selectedId]);

  const handleDeleteMany = useCallback((ids: string[]) => {
    deleteManyNotes(ids);
    if (selectedId && ids.includes(selectedId)) {
      setSelectedId(null);
    }
  }, [deleteManyNotes, selectedId]);

  const handleGraphNodeClick = useCallback((id: string) => {
    setSelectedId(id);
    setView('editor');
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05050f]">
        <div className="text-[#555] text-sm">Notlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#05050f]">
      <Sidebar
        notes={notes}
        selectedId={selectedId}
        search={search}
        onSearch={setSearch}
        onSelect={handleSelect}
        onNew={handleNew}
        onDeleteMany={handleDeleteMany}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.04] bg-[#05050f]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#c8956c] text-lg">☾</span>
            <span className="text-xs text-[#888] tracking-wider">{headerConfig.brandMark}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Semantic Threshold Slider (only in graph view) */}
            {view === 'graph' && (
              <div className="flex items-center gap-2 mr-4 px-3 py-1.5 bg-white/[0.03] rounded-lg">
                <span className="text-[10px] text-[#666]">Eşik:</span>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={semanticThreshold}
                  onChange={(e) => setSemanticThreshold(Number(e.target.value))}
                  className="w-24 h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#c8956c]"
                />
                <span className="text-[10px] text-[#888] w-8">%{semanticThreshold}</span>
              </div>
            )}

            {/* View Toggle */}
            <div className="flex bg-white/[0.03] rounded-lg p-0.5 mr-4">
              <button
                onClick={() => setView('editor')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  view === 'editor' ? 'bg-white/[0.08] text-[#e0e0e0]' : 'text-[#555] hover:text-[#999]'
                }`}
              >
                {headerConfig.editorViewLabel}
              </button>
              <button
                onClick={() => setView('graph')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  view === 'graph' ? 'bg-white/[0.08] text-[#e0e0e0]' : 'text-[#555] hover:text-[#999]'
                }`}
              >
                {headerConfig.graphViewLabel}
              </button>
            </div>

            <button
              onClick={() => navigate('/discover')}
              className="px-3 py-1.5 text-[10px] rounded-lg bg-white/[0.04] text-[#666] hover:bg-white/[0.08] hover:text-[#aaa] transition-colors border border-white/[0.06]"
            >
              ← {headerConfig.noteCountSuffix}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          {view === 'editor' ? (
            selectedNote ? (
              <NoteEditor
                note={selectedNote}
                allNotes={notes}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onNavigate={handleNavigate}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl text-[#c8956c]/30 mb-4">☾</div>
                  <p className="text-[#555] text-sm mb-2">Bir not seçin veya oluşturun</p>
                  <button
                    onClick={handleNew}
                    className="px-4 py-2 text-xs rounded-lg bg-[#c8956c]/20 text-[#c8956c] hover:bg-[#c8956c]/30 transition-colors"
                  >
                    + Yeni Not
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="h-full w-full">
              {notes.length > 0 ? (
                <GraphView
                  data={{ nodes: buildGraphData(notes).nodes, edges: [] }}
                  wikiEdges={wikiEdges}
                  semanticEdges={semanticEdges}
                  onNodeClick={handleGraphNodeClick}
                  selectedNodeId={selectedId}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-[#c8956c]/30 mb-4">◈</div>
                    <p className="text-[#555] text-sm">{graphConfig.emptyGraphLabel}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Note Count Footer */}
        <div className="px-6 py-2 border-t border-white/[0.04] text-[10px] text-[#444]">
          {notes.length} {headerConfig.noteCountSuffix}
        </div>
      </div>
    </div>
  );
}
