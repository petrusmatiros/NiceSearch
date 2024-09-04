interface SearchResultProps {
  _id: string;
  _type: string;
  title: string;
  slug: { _type: string; current: string };
  author: { _ref: string; _type: string };
  publishedAt: string;
}

export default function SearchResult({ _id, title, slug, publishedAt }: SearchResultProps) {
  return (
    <div key={_id} className="flex flex-col gap-2 p-2 bg-blue-200 rounded-sm">
      <h1 className="text-base font-bold">{title}</h1>
      <small>{slug.current}</small>
      <small>{publishedAt}</small>
    </div>
  );
}
