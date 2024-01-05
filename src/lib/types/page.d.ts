export type PageMetadata = {
  title: string
  huc?: string
};

export interface MarkdownComponent {
	default: any;
	metadata: PageMetadata;
}

export type ImportGlobRecord = Record<string, () => Promise<any>>;
