interface PostSearchResultProps {
  _id: string;
  _type: string;
  title: string;
  slug: { _type: string; current: string };
  author: { _ref: string; _type: string };
  publishedAt: string;
}

function PostSearchResult({ _id, title, slug, publishedAt }: PostSearchResultProps) {

  return <div
    key={_id}
    className="flex flex-col gap-2 p-2 bg-gray-300 rounded-sm"
  >
    <h1 className="text-base font-bold">{title}</h1>
    <small>{slug.current}</small>
    <small>{publishedAt}</small>
  </div>
}

export default PostSearchResult;
