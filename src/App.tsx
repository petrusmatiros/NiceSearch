import { useEffect, useState } from 'react';
import './App.css';
import Searcher from './Searcher';
import PostSearchResult from './PostSearchResult';

interface SearchableMapping {
  searchableField: string;
  component: (props: any) => JSX.Element;
  idField: string;
  dataSet: any[];
}

function App() {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Map<string, any[]>>(
    new Map()
  );

  const searchableMapping: Record<string, SearchableMapping> = {
    post: {
      searchableField: 'title',
      idField: '_id',
      component: PostSearchResult,
      dataSet: [
        {
          _id: 'post1',
          _type: 'post',
          title: 'Exploring the Wonders of the Universe',
          slug: {
            _type: 'slug',
            current: 'exploring-the-wonders-of-the-universe',
          },
          author: { _ref: 'author1', _type: 'reference' },
          publishedAt: '2024-09-01T12:00:00Z',
        },
        {
          _id: 'post2',
          _type: 'post',
          title: 'The Beauty of Nature',
          slug: { _type: 'slug', current: 'the-beauty-of-nature' },
          author: { _ref: 'author2', _type: 'reference' },
          publishedAt: '2024-08-28T09:30:00Z',
        },
        {
          _id: 'post3',
          _type: 'post',
          title: 'A Journey Through Time',
          slug: { _type: 'slug', current: 'a-journey-through-time' },
          author: { _ref: 'author3', _type: 'reference' },
          publishedAt: '2024-07-15T15:00:00Z',
        },
        {
          _id: 'post4',
          _type: 'post',
          title: 'The Future of Space Exploration',
          slug: { _type: 'slug', current: 'the-future-of-space-exploration' },
          author: { _ref: 'author4', _type: 'reference' },
          publishedAt: '2024-06-20T08:00:00Z',
        },
        {
          _id: 'post5',
          _type: 'post',
          title: 'Discovering Ancient Civilizations',
          slug: { _type: 'slug', current: 'discovering-ancient-civilizations' },
          author: { _ref: 'author5', _type: 'reference' },
          publishedAt: '2024-05-10T12:30:00Z',
        },
      ],
    },
  };

  useEffect(() => {
    console.log(searchResults.get('post'));
    console.log(searchString);
  }, [searchString]);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col">
        <div className="flex flex-col top-0 w-full p-2">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            name="search"
            autoComplete="off"
            aria-label="search"
            autoCapitalize="off"
            autoCorrect="off"
            title="search"
            placeholder="Search posts"
            className="border-2 border-black rounded-sm focus:outline-none px-2 py-1 w-full"
            onChange={(e) => {
              setSearchString(e.target.value.trim());
            }}
          />
        </div>
        <div className="flex flex-row w-full gap-2 p-2 cursor-pointer select-none">
          <div>All</div>
          {Object.keys(searchableMapping).map((key) => {
            return (
              <Searcher
                key={key}
                searcherName={key}
                searcherDataSet={searchableMapping[key].dataSet}
                searcherSearchableField={searchableMapping[key].searchableField}
                searcherIdField={searchableMapping[key].idField}
                searchString={searchString}
                setSearchResults={setSearchResults}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 bg-gray-200 rounded-sm h-full">
        {Array.from(searchResults).map(([key, value]) => {
          if (searchResults.get(key)?.length === 0) {
            return (
              <div key={key} className="flex flex-col gap-2 p-2 bg-gray-300 rounded-sm">
                <h1 className="text-base font-bold">No results found</h1>
              </div>
            );
          }
          const SearchResultComponent = searchableMapping[key].component;
          return value.map((result: any) => {
            return <SearchResultComponent key={result._id} {...result} />;
          });
        })}
      </div>
    </div>
  );
}

export default App;
