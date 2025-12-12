import { BoothViewer } from "./BoothViewer";
import { RendererRegistry } from "./types";

/**
 * Registry of custom code block renderers.
 * Map language identifiers (e.g., ```booth) to React components.
 */
export const RENDERER_REGISTRY: RendererRegistry = {
  booth: BoothViewer,
  "3d": BoothViewer
  // Add more renderers here
  // chart: ChartRenderer,
  // map: MapRenderer,
};

export * from "./types";
