/* Buzz & Ink · knowledge graph — type declarations */

export interface GraphNode {
  /** Unique id, referenced by edges. */
  id: string;
  /** Text drawn beside the node (mono, screen-constant). */
  label?: string;
  /** Free-form grouping — searchable via filter(), no visual encoding. */
  group?: string;
  /** Explicit radius in world px; otherwise derived from degree. */
  size?: number;
  /** Force hub treatment (strong ink, ring, always labelled). */
  hub?: boolean;
  [key: string]: unknown;
}

export interface GraphEdge {
  from: string;
  to: string;
  /** 'soft' renders dashed with a weaker spring — affinities, not structure. */
  kind?: 'line' | 'soft';
  /** Draw in the accent color even at rest — sparing brand relations. */
  accent?: boolean;
  /** Spring multiplier, default 1. */
  strength?: number;
}

export interface GraphOptions {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  /** Which labels render at rest: hubs (default), all, or only on hover. */
  labels?: 'hubs' | 'all' | 'hover';
  /** Degree at which a node auto-promotes to hub. Default 7. */
  hubDegree?: number;
  /** Wheel/pinch zoom. Default true. */
  wheelZoom?: boolean;
  /** Gentle breathing while parked; off under prefers-reduced-motion. Default true. */
  idleDrift?: boolean;
  /** Faint world-space dot grid. Default true. */
  grid?: boolean;
  onSelect?: (node: GraphNode | null) => void;
  onHover?: (node: GraphNode | null) => void;
}

export interface GraphController {
  setData(data: { nodes: GraphNode[]; edges: GraphEdge[] }): void;
  /** Accent-highlight matching nodes, veil the rest. Empty query clears. Returns match count. */
  filter(query: string): number;
  select(id: string | null): void;
  fit(animate?: boolean): void;
  center(): void;
  zoomIn(): void;
  zoomOut(): void;
  stats(): { nodes: number; edges: number; hubs: number };
  node(id: string): GraphNode | null;
  destroy(): void;
}

/**
 * Mount a token-driven force-directed knowledge graph inside `container`.
 * The container gets the `.bi-graph` class and its own <canvas>; absolutely
 * positioned children (`.bi-graph-hud`) float above as chrome.
 */
export function knowledgeGraph(container: HTMLElement, options?: GraphOptions): GraphController;
