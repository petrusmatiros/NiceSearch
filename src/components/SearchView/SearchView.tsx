import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils';
import PostSearchResult from '../SearchResult/Post/PostSearchResult';
import Searcher from '../Searcher/Searcher';

interface SearchableMapping {
  searchableField: string;
  component: (props: any) => JSX.Element;
  idField: string;
  dataSet: any[];
}

const initialSearchCategory = 'all';
const inputSearchLabel = 'Search';
const inputSearchPlaceholder = 'Search for';
const inputSearchNoResults = 'No results found';

export default function SearchView() {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [searchCategory, setSearchCategory] = useState<string>(
    initialSearchCategory
  );
  const [amountOfSearchResults, setAmountOfSearchResults] = useState<number>(0);

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
    page: {
      searchableField: 'title',
      idField: '_id',
      component: PostSearchResult,
      dataSet: [
        {
          _id: 'page1',
          _type: 'page',
          title: 'About Us',
          slug: { _type: 'slug', current: 'about-us' },
        },
        {
          _id: 'page2',
          _type: 'page',
          title: 'Contact Us',
          slug: { _type: 'slug', current: 'contact-us' },
        },
        {
          _id: 'page3',
          _type: 'page',
          title: 'Privacy Policy',
          slug: { _type: 'slug', current: 'privacy-policy' },
        },
        {
          _id: 'page4',
          _type: 'page',
          title: 'Terms of Service',
          slug: { _type: 'slug', current: 'terms-of-service' },
        },
      ],
    },
  };

  useEffect(() => {
    if (searchString.trim().length === 0) {
      console.log('useEffect', 'searchString');
      for (const key in searchableMapping) {
        setSearchResults((prev) => {
          return {
            ...prev,
            [key]: searchableMapping[key].dataSet,
          };
        });
      }
    }
  }, [searchString]);

  useEffect(() => {
    if (searchString.trim().length === 0) {
      return;
    }
    setSearchResults((prev) => {
      const newResults: { [key: string]: any[] } = {};
      for (const key in prev) {
        newResults[key] = prev[key].filter((result) => {
          return result[searchableMapping[key].searchableField]
            .toString()
            .toLowerCase()
            .includes(searchString.toLowerCase());
        });
      }
      return newResults;
    });
  }, [searchCategory]);

  useEffect(() => {
    console.log(searchResults);
    setAmountOfSearchResults(
      Object.values(searchResults).reduce((acc, curr) => {
        if (!curr) {
          return acc;
        }

        return acc + curr.length;
      }, 0)
    );
  }, [searchResults]);

  return (
    searchCategory && (
      <div className="flex flex-col gap-8 h-full">
        <div className="flex flex-col">
          <div className="flex flex-col top-0 w-full p-2 gap-2">
            <label htmlFor="search">{inputSearchLabel}</label>
            <input
              type="text"
              id="search"
              name="search"
              autoComplete="off"
              aria-label="search"
              autoCapitalize="off"
              autoCorrect="off"
              title="search"
              placeholder={`${searchCategory === initialSearchCategory ? inputSearchPlaceholder + '...' : inputSearchPlaceholder + ' ' + searchCategory + '(s)'}`}
              className="border-2 border-black rounded-sm focus:outline-none px-2 py-1 w-full"
              onInput={(e) => {
                setSearchString((e.target as HTMLInputElement).value);
              }}
            />
          </div>
          <div className="flex flex-row flex-wrap w-full gap-2 p-2">
            <div
              className={clsx(
                'cursor-pointer select-none py-2 px-8 bg-blue-400 rounded-sm',
                searchCategory === initialSearchCategory &&
                'bg-blue-600 text-white'
              )}
              onClick={() => {
                setSearchCategory(initialSearchCategory);
              }}
            >
              <p>
                {capitalizeFirstLetter(initialSearchCategory)}{' '}
                {<span>{amountOfSearchResults}</span>}
              </p>
            </div>
            {Object.keys(searchableMapping).map((key) => {
              return (
                <Searcher
                  className={clsx(
                    'cursor-pointer select-none py-2 px-8 bg-blue-400 rounded-sm',
                    searchCategory === key && 'bg-blue-600 text-white'
                  )}
                  key={key}
                  searcherName={key}
                  searcherFuzzyOptions={{ intraMode: 1 }}
                  searcherDataSet={searchableMapping[key].dataSet}
                  searcherSearchableField={
                    searchableMapping[key].searchableField
                  }
                  searcherIdField={searchableMapping[key].idField}
                  searchString={searchString}
                  amountOfResults={searchResults[key]?.length}
                  allowSearchExecution={searchCategory === key || searchCategory === initialSearchCategory}
                  setSearchResults={setSearchResults}
                  onClick={() => {
                    setSearchCategory(key);
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col bg-blue-50 rounded-sm h-full">
          <div className="grid grid-cols-4 row-span-1 gap-2 p-2">
            {searchResults &&
              Object.entries(searchResults).every(([_, value]) => {
                return value.length > 0;
              })
              ? Object.entries(searchResults)
                .filter(
                  ([key, _]) =>
                    key === searchCategory ||
                    searchCategory === initialSearchCategory
                )
                .map(([key, value]) => {
                  if (!value.length) {
                    return null;
                  }
                  if (!searchableMapping[key]) {
                    return null;
                  }

                  if (!searchableMapping[key].component) {
                    return null;
                  }
                  const SearchResultComponent =
                    searchableMapping[key].component;
                  return value.map((result: any) => {
                    return (
                      <SearchResultComponent key={result._id} {...result} />
                    );
                  });
                })
              : <div className='flex flex-col w-full p-2 font-bold text-xl'>{inputSearchNoResults}</div>}

          </div>
        </div>
      </div>
    )
  );
}