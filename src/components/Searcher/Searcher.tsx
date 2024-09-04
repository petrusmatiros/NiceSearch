import uFuzzy from '@leeoniya/ufuzzy';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/utils';
import { UNIQUE_HASH } from '../../constants/constants';

interface SearcherProps {
  className?: string;
  config: {
    searcherName: string;
    searcherFuzzyOptions?: uFuzzy.Options;
    searcherDataSet: any[];
    searcherSearchableFields: string[];
    searcherIdField: string;
    searchMaxResultCap: number;
  };
  state: {
    searchCategory: string;
    searchString: string;
    amountOfResults: number;
    hidden: boolean;
    allowSearchExecution: boolean;
    setSearchResults: Dispatch<SetStateAction<{ [key: string]: any[] }>>;
    setSearchResultsComputedTime: Dispatch<SetStateAction<{ [key: string]: number }>>;
  };
  onClick: (data: any) => void;
}

export default function Searcher({
  config: {
    searcherName,
    searcherFuzzyOptions,
    searcherDataSet,
    searcherSearchableFields,
    searcherIdField,
    searchMaxResultCap
  },
  state: {
    searchCategory,
    searchString,
    amountOfResults,
    hidden,
    allowSearchExecution,
    setSearchResults,
    setSearchResultsComputedTime,
  },
  onClick,
  className,
}: SearcherProps) {
  const [fuzzyRef, setFuzzyRef] = useState<uFuzzy | null>(null);
  const [mainDataIndex, setMainDataIndex] = useState<Map<string, any>>(new Map());
  const [searchableDataSet, setSearchableDataSet] = useState<string[]>([]);
  const [searchIndex, setSearchIndex] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    function generateSearchableDataSet(data: any[], searchableFields: string[], idField: string): string[] | string {
      if (!data.length) {
        return 'No data provided';
      }
      if (!searchableFields || !searchableFields.length) {
        return 'No searchable fields provided';
      }
      if (!idField) {
        return 'No ID field provided';
      }

      const searchIndex = new Map();
      const mainDataIndex = new Map();

      if (searchIndex.size || mainDataIndex.size) {
        return 'Indices are not empty';
      }

      /**
       * Generate string data set out of searchable fields
       * Iterate through data, for each item, look through each searchable field
       * Ensure that the field exists, and is a string, and that we reach the nested field if it is nested
       * For each searchable field, add the field data to the searchIndex with an unique ID and push the data to the data set
       * After all of the searchable fields have been parsed for that given item, push the data to the dataset, and continue
       */
      const dataSet: string[] = [];
      for (let i = 0; i < data.length; ++i) {
        const item = data[i];
        const itemIdField = item[idField].toString();
        for (let k = 0; k < searchableFields.length; ++k) {
          const field = searchableFields[k];
          // Split field if it is nested
          const splitField = field.split('.');
          // Ensure that we get the field to search depending on if it is nested or not
          let fieldToSearch = splitField.length > 1 ? splitField.reduce((o, i) => o[i], item) : item[splitField[0]];

          // Ensure that the field exists, and is a not undefined or null
          const itemSearchableField = fieldToSearch ? fieldToSearch.toString() : '';

          // Generate index, ensure uniqueness by adding the index to the field
          const uniqueID = k + i * searchableFields.length;
          searchIndex.set(itemSearchableField + UNIQUE_HASH + uniqueID, itemIdField);

          dataSet.push(itemSearchableField);
        }

        // Passing reference to the main data
        mainDataIndex.set(itemIdField, item);
      }

      if (!dataSet.length) {
        return 'No dataset could be compiled';
      }

      // Set the indices
      setSearchIndex(searchIndex);
      setMainDataIndex(mainDataIndex);
      setFuzzyRef(new uFuzzy(searcherFuzzyOptions));
      return dataSet;
    }
    const dataSet = generateSearchableDataSet(searcherDataSet, searcherSearchableFields, searcherIdField);

    if (typeof dataSet === 'string') {
      console.error(dataSet);
    }

    setSearchableDataSet(dataSet as string[]);
  }, []);

  useEffect(() => {
    if (!allowSearchExecution) {
      return;
    }
    if (searchString.trim().length === 0) {
      return;
    }
    const computedTimeStart = performance.now();
    const resultsFromSearchExecution = executeSearch(
      fuzzyRef,
      mainDataIndex,
      searchableDataSet,
      searchIndex,
      searchString
    );
    const computedTime = performance.now() - computedTimeStart;
    setSearchResultsComputedTime((prev) => {
      return {
        ...prev,
        [searcherName]: computedTime,
      };
    });
    setSearchResults((prev) => {
      return {
        ...prev,
        [searcherName]: resultsFromSearchExecution,
      };
    });
  }, [searchString, searchCategory]);

  // const _mark = (part: any, matched: any) => matched ? `<mark>${part}</mark>` : part;
  // const _append = (acc: any, part: any) => acc + part;

  // function highlight(str: string, ranges: any[], mark = _mark, accum = '', append = _append) {
  //   accum = append(accum, mark(str.substring(0, ranges[0]), false)) ?? accum;

  //   for (let i = 0; i < ranges.length; i += 2) {
  //     let fr = ranges[i];
  //     let to = ranges[i + 1];

  //     accum = append(accum, mark(str.substring(fr, to), true)) ?? accum;

  //     if (i < ranges.length - 3)
  //       accum = append(accum, mark(str.substring(ranges[i + 1], ranges[i + 2]), false)) ?? accum;
  //   }

  //   accum = append(accum, mark(str.substring(ranges[ranges.length - 1]), false)) ?? accum;

  //   return accum;
  // }

  function executeSearch(
    fuzzy: uFuzzy | null,
    mainDataIndex: Map<string, any>,
    stringDataSet: string[],
    searchIndex: Map<string, string>,
    searchQuery: string
  ) {
    if (searchQuery.trim().length === 0) return [];
    if (!fuzzy) return [];

    const fuzzyResults = fuzzy.search(stringDataSet, searchQuery);

    // const limited = stringDataSet.slice(0, 1000);
    // const idxs = fuzzy.filter(limited, searchQuery);
    // const info = fuzzy.info(idxs || [], limited, searchQuery);
    // const order = fuzzy.sort(info, limited, searchQuery);
    // const mark = (part: string | null, matched: any) => {
    //   let el = matched ? document.createElement('mark') : document.createElement('span');
    //   el.textContent = part;
    //   return el;
    // };

    // const append = (accum: any[], part: any) => {
    //   accum.push(part);
    //   return accum;
    // };

    // for (let i = 0; i < order.length; ++i) {
    //   const infoIdx = order[i];

    //   const parts = highlight(
    //     stringDataSet[info.idx[infoIdx]],
    //     info.ranges[infoIdx],
    //     mark,
    //     [],
    //     append,
    //   );
    // }

    /**
     * The search results are processed in the following way:
     * 1. Fuzzy results are an array of arrays, where the first array is the best match
     * 2. The first array contains the indices of the best matches
     * 3. Using the indicies, the value of said matched field can be retrieved from the stringDataSet
     * 4. The value of the matched field can be used to retrieve the ID of the object from the searchIndex
     * 5. The ID can be used to retrieve the object from the mainDataIndex
     * 6. It is ensured that no duplicates may occur using seenIndices, since using multiple searchableFields, leads to multiple matches, mapped to the same object
     * 7. The object can be pushed to the searchResults array
     */
    const resultIndices = fuzzyResults[0] ?? [];
    const searchResults: any[] = [];
    const seenIndices: string[] = [];
    for (let i = 0; i < resultIndices.length; ++i) {
      if (i === searchMaxResultCap) {
        break;
      }
      const stringData = stringDataSet[resultIndices[i]];
      const retrievedIndexID = searchIndex.get(stringData + UNIQUE_HASH + resultIndices[i]);
      if (!retrievedIndexID) {
        continue;
      }
      if (seenIndices.includes(retrievedIndexID)) {
        continue;
      }

      const retrievedField = mainDataIndex.get(retrievedIndexID);
      const objectData = retrievedIndexID ? retrievedField : null;

      if (objectData) {
        searchResults.push(objectData);
        seenIndices.push(retrievedIndexID);
      }
    }
    return searchResults
  }

  return (
    !hidden && (
      <div onClick={onClick} className={className}>
        <p>
          {capitalizeFirstLetter(searcherName)} {<span className="tabular-nums">({amountOfResults})</span>}
        </p>
      </div>
    )
  );
}
