export interface CreateThemeOptions {
  /** Theme name — used for the injected style tag id. Default 'custom'. */
  name?: string;
  /** Any hex color — becomes the buzz (accent) scale; the seed sits at ≈ the 500 stop. */
  accent?: string;
  /** Any hex color — becomes the ink (neutral) scale; hue and a capped tint carry over. */
  neutral?: string;
  /** Any hex color — becomes the cream (paper) scale; hue carries over, chroma stays subtle. */
  paper?: string;
  /** CSS selector the overrides land on. Default ':root'; use '[data-bi-theme="name"]' to scope. */
  selector?: string;
}

export interface BuzzInkTheme {
  name: string;
  /** The generated CSS — write it to a file or serve it. */
  css: string;
  /** The generated custom properties, token → hex. */
  tokens: Record<string, string>;
  /** Inject (or replace) the theme's style tag in a document's head. */
  apply(doc?: Document): void;
}

export function createTheme(options?: CreateThemeOptions): BuzzInkTheme;
