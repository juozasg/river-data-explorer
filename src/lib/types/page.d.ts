export type PageMetadata = {
  title: string
  huc?: string
};

export type MarkdownComponent = {
	default: any;
	metadata: PageMetadata;
}

export type MarkdownPage = {
	metadata: PageMetadata;
	slug: string;
}

export type ImportGlobRecord = Record<string, () => Promise<any>>;
