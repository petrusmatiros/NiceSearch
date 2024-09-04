import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils';
import Searcher from '../Searcher/Searcher';
import { SearchableMapping } from '../../types/types';
import uFuzzy from '@leeoniya/ufuzzy';

interface SearchViewProps {
  initialSearchCategory: string;
  inputSearchLabel: string;
  inputSearchPlaceholder: string;
  inputSearchNoResults: string;
  maxAmountOfCards: number;
  searchableMapping: Record<string, SearchableMapping>;
  searcherFuzzyOptions: uFuzzy.Options;
}

export default function SearchView({
  initialSearchCategory,
  inputSearchLabel,
  inputSearchPlaceholder,
  inputSearchNoResults,
  maxAmountOfCards,
  searchableMapping,
  searcherFuzzyOptions,
}: SearchViewProps) {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [searchCategory, setSearchCategory] = useState<string>(
    initialSearchCategory
  );
  const [amountOfSearchResults, setAmountOfSearchResults] = useState<number>(0);
  const [searchShowNoResults, setSearchShowNoResults] =
    useState<boolean>(false);

  useEffect(() => {
    if (searchString.trim().length === 0) {
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
  }, [searchCategory]);

  useEffect(() => {
    // TODO:
    // When category is zero, show results not found - done
    // When another category is zero, hide the choice - done
    // Allow search for multiple fields and nested fields - done
    // Run search all the time
    // Add highlighting
    // Show amount of results
    // Show search time

    // Check if all results are empty (for initial search category) or if the current category is empty
    const resultsAreEmpty =
      searchCategory === initialSearchCategory
        ? Object.entries(searchResults).every(([_, value]) => {
          return value.length === 0;
        })
        : searchResults[searchCategory].length === 0;

    setSearchShowNoResults(resultsAreEmpty);

    const amountOfResults = Object.values(searchResults).reduce((acc, curr) => {
      return acc + curr.length;
    }, 0);
    console.log(amountOfResults);
    setAmountOfSearchResults(amountOfResults);
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
            {!searchShowNoResults && <div
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
            </div>}
            {Object.keys(searchableMapping).map((key) => {
              return (
                <Searcher
                  className={clsx(
                    'cursor-pointer select-none py-2 px-8 bg-blue-400 rounded-sm',
                    searchCategory === key && 'bg-blue-600 text-white'
                  )}
                  key={key}
                  searcherName={key}
                  searcherFuzzyOptions={searcherFuzzyOptions}
                  searcherDataSet={searchableMapping[key].dataSet}
                  searcherSearchableFields={
                    searchableMapping[key].searchableFields
                  }
                  searcherIdField={searchableMapping[key].idField}
                  searchString={searchString}
                  searchCategory={searchCategory}
                  initialSearchCategory={initialSearchCategory}
                  amountOfResults={searchResults[key]?.length}
                  hidden={searchShowNoResults}
                  allowSearchExecution={true}
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
            {searchShowNoResults ? (
              <div className="flex flex-col w-full p-2 font-bold text-xl">
                {inputSearchNoResults}
              </div>
            ) : (
              Object.entries(searchResults)
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
                  return value.map((result: any, index: number) => {
                    if (index > maxAmountOfCards) {
                      return null;
                    }
                    return (
                      <SearchResultComponent key={result._id} {...result} />
                    );
                  });
                })
            )}
          </div>
        </div>
      </div>
    )
  );
}
