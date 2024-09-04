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
      searchAmountOfResultsSuffixLabel: string;
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
      searchAmountOfResultsSuffixLabel,
      searchResultTimeAmountOfDecimals,
      searchResultTimeFormat,
      searchMaxAmountOfCards,
    },
  },
  input: { inputSearchLabel, inputSearchPlaceholder, inputSearchNoResults },
}: SearchViewProps) {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ [key: string]: any[] }>({});
  const [searchCategory, setSearchCategory] = useState<string>(searchInitialCategory);
  const [searchTotalResultAmount, setSearchTotalResultAmount] = useState<number>(0);
  const [searchTotalExecutionTime, setSearchTotalExecutionTime] = useState<string>('');
  const [searchResultsComputedTime, setSearchResultsComputedTime] = useState<{
    [key: string]: number;
  }>({});
  const [searchShowNoResults, setSearchShowNoResults] = useState<boolean>(false);

  /**
   * searchString
   * =--------------------------=--------------------------=--------------------------=--------------------------=--------------------------
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
   * searchResults
   * =--------------------------=--------------------------=--------------------------=--------------------------=--------------------------
   * Check if all results are empty and if so, show no results found
   */
  useEffect(() => {
    // TODO:
    // When category is zero, show results not found - done
    // When another category is zero, hide the choice - done
    // Allow search for multiple fields and nested fields - done
    // Run search all the time - done
    // Add highlighting
    // Show amount of results - done
    // Show search time - done

    // Check if all results are empty (for initial search category) or if the current category is empty
    const resultsAreEmpty =
      searchCategory === searchInitialCategory
        ? Object.entries(searchResults).every(([_, value]) => {
            return value.length === 0;
          })
        : searchResults[searchCategory].length === 0;
    setSearchShowNoResults(resultsAreEmpty);

    if (searchCategory === searchInitialCategory) {
      setSearchTotalResultAmount(
        Object.values(searchResults).reduce((acc, curr) => {
          return acc + curr.length;
        }, 0)
      );
    }
  }, [searchResults]);

  /**
   * searchCategory
   * =--------------------------=--------------------------=--------------------------=--------------------------=--------------------------
   */
  useEffect(() => {}, [searchCategory]);

  /**
   * searchResultsComputedTime
   * =--------------------------=--------------------------=--------------------------=--------------------------=--------------------------
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
      `${computedTime.toFixed(searchResultTimeAmountOfDecimals / searchResultTimeFormat.divideBy)} ${searchResultTimeFormat.suffix}`
    );
  }, [searchResultsComputedTime]);

  /**
   * Components
   * =--------------------------=--------------------------=--------------------------=--------------------------=--------------------------
   */

  const searchInputComponent = () => {
    return (
      <div className="top-0 flex w-full flex-col gap-2 p-2">
        <label htmlFor="search">{inputSearchLabel}</label>
        <input
          className="w-full rounded-sm border-2 border-transparent px-2 py-1 outline-none transition-all duration-150 ease-in-out focus-visible:border-b-black focus-visible:bg-gray-50"
          type="text"
          id="search"
          name="search"
          autoComplete="off"
          aria-label="search"
          autoCapitalize="off"
          autoCorrect="off"
          title="search"
          placeholder={`${searchCategory === searchInitialCategory ? inputSearchPlaceholder + '...' : inputSearchPlaceholder + ' ' + searchCategory + '(s)'}`}
          onInput={(e) => {
            setSearchString((e.target as HTMLInputElement).value);
          }}
        />
      </div>
    );
  };

  const searchResultsInfoComponent = () => {
    return (
      <div className="flex w-full flex-col px-6 py-2">
        <p className="tabular-nums">{`${searchCategory === searchInitialCategory ? searchTotalResultAmount : searchResults[searchCategory]?.length} ${searchAmountOfResultsSuffixLabel}`}</p>
        <p className="tabular-nums">{`${searchResultTimePrefixLabel} ${searchTotalExecutionTime}`}</p>
      </div>
    );
  };

  const searchCategoriesComponent = () => {
    return (
      <div className="flex w-full flex-row flex-wrap gap-2 p-2">
        {!searchShowNoResults && (
          <div
            className={clsx(
              'cursor-pointer select-none rounded-sm bg-gray-400 px-8 py-2',
              searchCategory === searchInitialCategory && 'bg-gray-600 text-white'
            )}
            onClick={() => {
              setSearchCategory(searchInitialCategory);
            }}
          >
            <p>
              {capitalizeFirstLetter(searchInitialCategory)}{' '}
              {<span className="tabular-nums">{searchTotalResultAmount}</span>}
            </p>
          </div>
        )}
        {Object.keys(searchableMapping).map((key) => {
          return (
            <Searcher
              key={key}
              className={clsx(
                'cursor-pointer select-none rounded-sm bg-gray-400 px-8 py-2',
                searchCategory === key && 'bg-gray-600 text-white'
              )}
              config={{
                searcherName: key,
                searcherFuzzyOptions: searcherFuzzyOptions,
                searcherDataSet: searchableMapping[key].dataSet,
                searcherSearchableFields: searchableMapping[key].searchableFields,
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
      <div className="flex h-full flex-col rounded-sm bg-gray-50">
        <div className="row-span-1 grid grid-cols-4 gap-2 p-2">
          {searchShowNoResults ? (
            <div className="flex w-full flex-col p-2 text-xl font-bold">{inputSearchNoResults}</div>
          ) : (
            Object.entries(searchResults)
              .filter(([key, _]) => key === searchCategory || searchCategory === searchInitialCategory)
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
      <div className="flex h-full flex-col gap-8">
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
