import { useEffect, useState } from 'react';
import uFuzzy from '@leeoniya/ufuzzy';
import './App.css';

interface MainDataItem {
  _id: string;
  _type: string;
  title: string;
  slug: { _type: string; current: string };
  author: { _ref: string; _type: string };
  publishedAt: string;
}

function Index() {
  const options: uFuzzy.Options = {
    intraIns: 1
  }
  const fuzzy = new uFuzzy();
  const [searchIndex, setSearchIndex] = useState<Map<string, string>>(
    new Map()
  );
  const [mainDataIndex, setMainDataIndex] = useState<Map<string, any>>(
    new Map()
  );
  const [searchableDataSet, setSearchableDataSet] = useState<string[]>([]);
  const [mainDataSet, setMainDataSet] = useState<MainDataItem[]>([
    {
      _id: 'post1',
      _type: 'post',
      title: 'Exploring the Wonders of the Universe',
      slug: { _type: 'slug', current: 'exploring-the-wonders-of-the-universe' },
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
  ]);
  const [searchResults, setSearchResults] = useState<MainDataItem[]>([]);

  useEffect(() => {
    function generateSearchableDataSet(
      data: any[],
      searchableField: string,
      idField: string
    ): string[] | string {
      if (!data.length) {
        return 'No data provided';
      }
      if (!searchableField) {
        return 'No searchable field provided';
      }
      if (!idField) {
        return 'No ID field provided';
      }

      const searchIndex = new Map();
      const mainDataIndex = new Map();

      if (searchIndex.size || mainDataIndex.size) {
        return 'Indices are not empty';
      }

      // Generate searchable string dataset
      const dataSet: string[] = [];
      for (let i = 0; i < data.length; ++i) {
        const item = data[i];
        const itemSearchableField = item[searchableField].toString();
        const itemIdField = item[idField].toString();

        // Generate index (overriding duplicates)
        searchIndex.set(itemSearchableField, itemIdField);
        // Passing reference to the main data
        mainDataIndex.set(itemIdField, item);

        dataSet.push(itemSearchableField.toString());
      }

      if (!dataSet.length) {
        return 'No dataset could be compiled';
      }

      // Set the indices
      setSearchIndex(searchIndex);
      setMainDataIndex(mainDataIndex);

      return dataSet;
    }

    const dataSet = generateSearchableDataSet(mainDataSet, 'title', '_id');

    if (typeof dataSet === 'string') {
      console.error(dataSet);
    }

    setSearchableDataSet(dataSet as string[]);
    // NOTE: Remove this later, Show all initially (should be removed for multiple datasets)
    setSearchResults(mainDataSet);
  }, []);

  function executeSearch(
    fuzzy: uFuzzy,
    mainDataIndex: Map<string, any>,
    stringDataSet: string[],
    searchIndex: Map<string, string>,
    searchString: string
  ) {
    if (searchString.trim().length === 0) {
      return [];
    }
    const fuzzyResults = fuzzy.search(stringDataSet, searchString, 0,);
    // Select first entry of results, since the first array contains the search results
    const resultIndices = fuzzyResults[0] ?? [];
    const searchResults: any[] = [];
    for (let i = 0; i < resultIndices.length; ++i) {
      const retrievedIndexID = searchIndex.get(stringDataSet[resultIndices[i]]);
      const objectData = retrievedIndexID
        ? mainDataIndex.get(retrievedIndexID)
        : null;
      if (objectData) {
        searchResults.push(objectData);
      }
    }
    return searchResults;
  }

  return (
    <div className='flex flex-col gap-8 h-full'>
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
            const results = executeSearch(
              fuzzy,
              mainDataIndex,
              searchableDataSet,
              searchIndex,
              e.target.value
            );
            // NOTE: Remove this later, sets all if string is empty
            setSearchResults(e.target.value ? results : mainDataSet);
          }}
        />
      </div>
      <div className='flex flex-col gap-2 p-2 bg-gray-200 rounded-sm h-full'>
        {searchResults.map((item) => {
          return (
            <div key={item._id} className='flex flex-col gap-2 p-2 bg-gray-300 rounded-sm'>
              <h1 className='text-base font-bold'>{item.title}</h1>
              <small>{item.slug.current}</small>
              <small>{item.publishedAt}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Index;
