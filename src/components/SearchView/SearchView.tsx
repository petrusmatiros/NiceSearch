import uFuzzy from '@leeoniya/ufuzzy';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { SearchableMapping, TimeFormatKeyType } from '../../types/types';
import { capitalizeFirstLetter } from '../../utils/utils';
import Searcher from '../Searcher/Searcher';

interface SearchViewProps {
  search: {
    config: {
      searchableMapping: Record<string, SearchableMapping>;
      searcherFuzzyOptions: uFuzzy.Options;
      searchInitialCategory: string;
    };
    results: {
      searchResultTimePrefixLabel: string;
      searchResultTimeAmountOfDecimals: number;
      searchResultTimeFormat: TimeFormatKeyType;
      searchMaxAmountOfCards: number;
    };
  };
  input: {
    inputSearchLabel: string;
    inputSearchPlaceholder: string;
    inputSearchNoResults: string;
  };
}

export default function SearchView({
  search: {
    config: { searchableMapping, searcherFuzzyOptions, searchInitialCategory },
    results: {
      searchResultTimePrefixLabel,
      searchResultTimeAmountOfDecimals,
      searchResultTimeFormat,
      searchMaxAmountOfCards,
    },
  },
  input: { inputSearchLabel, inputSearchPlaceholder, inputSearchNoResults },
}: SearchViewProps) {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [searchCategory, setSearchCategory] = useState<string>(
    searchInitialCategory
  );
  const [amountOfSearchResults, setAmountOfSearchResults] = useState<number>(0);
  const [searchTotalExecutionTime, setSearchTotalExecutionTime] =
    useState<string>('');
  const [searchResultsComputedTime, setSearchResultsComputedTime] = useState<{
    [key: string]: number;
  }>({});
  const [searchShowNoResults, setSearchShowNoResults] =
    useState<boolean>(false);

  /**
   * Set initial search results, or when search string is empty
   */
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

  /**
   * Check if all results are empty and if so, show no results found
   */
  useEffect(() => {
    // TODO:
    // When category is zero, show results not found - done
    // When another category is zero, hide the choice - done
    // Allow search for multiple fields and nested fields - done
    // Run search all the time - done
    // Add highlighting
    // Show amount of results
    // Show search time

    // Check if all results are empty (for initial search category) or if the current category is empty
    const resultsAreEmpty =
      searchCategory === searchInitialCategory
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

  /**
   * Calculate the total execution time of all search results or the current category
   */
  useEffect(() => {
    const computedTime =
      searchCategory === searchInitialCategory
        ? Object.values(searchResultsComputedTime).reduce((acc, curr) => {
            return acc + curr;
          }, 0)
        : searchResultsComputedTime[searchCategory];

    setSearchTotalExecutionTime(
      computedTime.toFixed(
        searchResultTimeAmountOfDecimals / searchResultTimeFormat.divideBy
      ) + searchResultTimeFormat.postfix
    );
  }, [searchResultsComputedTime]);

  const searchInputComponent = () => {
    return (
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
          placeholder={`${searchCategory === searchInitialCategory ? inputSearchPlaceholder + '...' : inputSearchPlaceholder + ' ' + searchCategory + '(s)'}`}
          className="border-2 border-black rounded-sm focus:outline-none px-2 py-1 w-full"
          onInput={(e) => {
            setSearchString((e.target as HTMLInputElement).value);
          }}
        />
      </div>
    );
  };

  const searchResultsInfoComponent = () => {
    return (
      <div>
        <p>{`${searchResultTimePrefixLabel} ${searchTotalExecutionTime}`}</p>
      </div>
    );
  };

  const searchCategoriesComponent = () => {
    return (
      <div className="flex flex-row flex-wrap w-full gap-2 p-2">
        {!searchShowNoResults && (
          <div
            className={clsx(
              'cursor-pointer select-none py-2 px-8 bg-blue-400 rounded-sm',
              searchCategory === searchInitialCategory &&
                'bg-blue-600 text-white'
            )}
            onClick={() => {
              setSearchCategory(searchInitialCategory);
            }}
          >
            <p>
              {capitalizeFirstLetter(searchInitialCategory)}{' '}
              {<span>{amountOfSearchResults}</span>}
            </p>
          </div>
        )}
        {Object.keys(searchableMapping).map((key) => {
          return (
            <Searcher
              key={key}
              className={clsx(
                'cursor-pointer select-none py-2 px-8 bg-blue-400 rounded-sm',
                searchCategory === key && 'bg-blue-600 text-white'
              )}
              config={{
                searcherName: key,
                searcherFuzzyOptions: searcherFuzzyOptions,
                searcherDataSet: searchableMapping[key].dataSet,
                searcherSearchableFields:
                  searchableMapping[key].searchableFields,
                searcherIdField: searchableMapping[key].idField,
              }}
              state={{
                searchString: searchString,
                searchCategory: searchCategory,
                amountOfResults: searchResults[key]?.length,
                hidden: searchShowNoResults,
                allowSearchExecution: true,
                setSearchResults: setSearchResults,
                setSearchResultsComputedTime: setSearchResultsComputedTime,
              }}
              onClick={() => {
                setSearchCategory(key);
              }}
            />
          );
        })}
      </div>
    );
  };

  const searchResultsComponent = () => {
    return (
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
                  searchCategory === searchInitialCategory
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
                const SearchResultComponent = searchableMapping[key].component;
                return value.map((result: any, index: number) => {
                  if (index > searchMaxAmountOfCards) {
                    return null;
                  }
                  return <SearchResultComponent key={result._id} {...result} />;
                });
              })
          )}
        </div>
      </div>
    );
  };

  return (
    searchCategory && (
      <div className="flex flex-col gap-8 h-full">
        <div className="flex flex-col">
          {searchInputComponent()}
          {searchResultsInfoComponent()}
          {searchCategoriesComponent()}
        </div>
        {searchResultsComponent()}
      </div>
    )
  );
}
