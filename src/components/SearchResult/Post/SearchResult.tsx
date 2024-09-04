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
    <div id={_id} className="flex flex-col gap-2 rounded-sm bg-gray-200 p-2">
      {title && <h1 className="text-base font-bold">{title}</h1>}
      {slug?.current && <small>{slug.current}</small>}
      {publishedAt && <small>{publishedAt}</small>}
    </div>
  );
}
