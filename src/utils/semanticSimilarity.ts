import type { Note, GraphEdge } from '../types';

// Turkish stopwords
const STOPWORDS = new Set([
  've', 'veya', 'ile', 'için', 'bu', 'şu', 'o', 'bir', 'birkaç', 'birçok',
  'her', 'bazı', 'tüm', 'çok', 'az', 'daha', 'en', 'gibi', 'kadar', ' göre',
  'kendi', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar', 'benim', 'senin', 'onun',
  'bizim', 'sizin', 'onların', 'bana', 'sana', 'ona', 'bize', 'size', 'onlara',
  'bu', 'şu', 'o', 'bunu', 'şunu', 'onu', 'burada', 'orada', 'nerede', 'her yerde',
  'şimdi', 'sonra', 'önce', 'dün', 'bugün', 'yarın', 'her zaman', 'bazen',
  'çünkü', 'eğer', 'ancak', 'fakat', 'lakin', 'ya', 'ya da', 'hem', 'de', 'da',
  'mi', 'mı', 'mu', 'mü', 'ki', 'için', 'ile', 'gibi', 'kadar', 'göre', 'rağmen',
  'karşın', 'beri', 'sonra', 'önce', 'üzere', 'doğru', 'karşı', 'boyunca',
  'yerine', 'önce', 'sonra', 'sırada', 'sırasında', 'zaman', 'zamanında',
  'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in',
  'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and',
  'but', 'if', 'or', 'because', 'until', 'while', 'what', 'which', 'who', 'whom',
  'this', 'that', 'these', 'those', 'am', 'an', 'it', 'its', 'they', 'them',
  'their', 'we', 'you', 'he', 'she', 'him', 'her', 'his', 'himself', 'herself',
  'itself', 'themselves', 'myself', 'yourself', 'yourselves', 'ourselves',
]);

/** Extract meaningful tokens from text */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sğüşıöç]/gi, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

/** Calculate term frequency for a document */
function calculateTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;
  
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1 / total);
  }
  
  return tf;
}

/** Calculate cosine similarity between two TF maps */
function cosineSimilarity(tf1: Map<string, number>, tf2: Map<string, number>): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  // Calculate dot product and magnitudes
  for (const [term, freq1] of tf1) {
    mag1 += freq1 * freq1;
    const freq2 = tf2.get(term);
    if (freq2 !== undefined) {
      dotProduct += freq1 * freq2;
    }
  }
  
  for (const [, freq2] of tf2) {
    mag2 += freq2 * freq2;
  }
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

/** Calculate semantic similarity between two notes (0-1) */
export function calculateNoteSimilarity(note1: Note, note2: Note): number {
  // Combine title and content for comparison
  const text1 = `${note1.title} ${note1.title} ${note1.content}`; // Title weighted 2x
  const text2 = `${note2.title} ${note2.title} ${note2.content}`;
  
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  
  // If either has no meaningful tokens, no similarity
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  
  const tf1 = calculateTF(tokens1);
  const tf2 = calculateTF(tokens2);
  
  return cosineSimilarity(tf1, tf2);
}

/** Build semantic edges between notes above threshold */
export function buildSemanticEdges(
  notes: Note[],
  threshold: number = 0.2,
  maxEdgesPerNode: number = 5
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const edgeKeys = new Set<string>();
  
  // Calculate similarities for all pairs
  const similarities: { source: string; target: string; score: number }[] = [];
  
  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const note1 = notes[i];
      const note2 = notes[j];
      
      const score = calculateNoteSimilarity(note1, note2);
      
      if (score >= threshold) {
        similarities.push({
          source: note1.id,
          target: note2.id,
          score,
        });
      }
    }
  }
  
  // Sort by score descending
  similarities.sort((a, b) => b.score - a.score);
  
  // Track edges per node to limit max connections
  const edgesPerNode = new Map<string, number>();
  
  for (const sim of similarities) {
    const count1 = edgesPerNode.get(sim.source) || 0;
    const count2 = edgesPerNode.get(sim.target) || 0;
    
    if (count1 < maxEdgesPerNode && count2 < maxEdgesPerNode) {
      const key = [sim.source, sim.target].sort().join('::');
      if (!edgeKeys.has(key)) {
        edgeKeys.add(key);
        edges.push({
          source: sim.source,
          target: sim.target,
          semantic: true,
          strength: sim.score,
        });
        edgesPerNode.set(sim.source, count1 + 1);
        edgesPerNode.set(sim.target, count2 + 1);
      }
    }
  }
  
  return edges;
}

/** Hybrid graph data builder combining wiki links and semantic similarity */
export function buildHybridGraphData(
  notes: Note[],
  wikiEdges: GraphEdge[],
  semanticThreshold: number = 0.2
): { wikiEdges: GraphEdge[]; semanticEdges: GraphEdge[] } {
  // Get wiki link edges
  const wikiEdgeKeys = new Set(wikiEdges.map(e => [e.source, e.target].sort().join('::')));
  
  // Build semantic edges, excluding pairs already connected by wiki links
  const semanticEdges: GraphEdge[] = [];
  const similarities: { source: string; target: string; score: number }[] = [];
  
  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const note1 = notes[i];
      const note2 = notes[j];
      
      // Skip if already connected by wiki link
      const key = [note1.id, note2.id].sort().join('::');
      if (wikiEdgeKeys.has(key)) continue;
      
      const score = calculateNoteSimilarity(note1, note2);
      
      if (score >= semanticThreshold) {
        similarities.push({
          source: note1.id,
          target: note2.id,
          score,
        });
      }
    }
  }
  
  // Sort by score and limit per node
  similarities.sort((a, b) => b.score - a.score);
  const edgesPerNode = new Map<string, number>();
  const MAX_SEMANTIC_EDGES = 5;
  
  for (const sim of similarities) {
    const count1 = edgesPerNode.get(sim.source) || 0;
    const count2 = edgesPerNode.get(sim.target) || 0;
    
    if (count1 < MAX_SEMANTIC_EDGES && count2 < MAX_SEMANTIC_EDGES) {
      semanticEdges.push({
        source: sim.source,
        target: sim.target,
        semantic: true,
        strength: sim.score,
      });
      edgesPerNode.set(sim.source, count1 + 1);
      edgesPerNode.set(sim.target, count2 + 1);
    }
  }
  
  return { wikiEdges, semanticEdges };
}
