import { useEffect, useState } from "react";
import uFuzzy from "@leeoniya/ufuzzy";
import "./App.css";

function Index() {
  const fuzzy = new uFuzzy();
  const [searchIndex, setSearchIndex] = useState<Map<string, string>>(
    new Map()
  );
  const [mainDataIndex, setMainDataIndex] = useState<Map<string, any>>(
    new Map()
  );
  const [searchableDataSet, setSearchableDataSet] = useState<string[]>([]);
  const [mainDataSet, setMainDataSet] = useState<any[]>([
    {
      _id: "post1",
      _type: "post",
      title: "Exploring the Wonders of the Universe",
      slug: { _type: "slug", current: "exploring-the-wonders-of-the-universe" },
      author: { _ref: "author1", _type: "reference" },
      publishedAt: "2024-09-01T12:00:00Z",
    },
    {
      _id: "post2",
      _type: "post",
      title: "The Beauty of Nature",
      slug: { _type: "slug", current: "the-beauty-of-nature" },
      author: { _ref: "author2", _type: "reference" },
      publishedAt: "2024-08-28T09:30:00Z",
    },
    {
      _id: "post3",
      _type: "post",
      title: "A Journey Through Time",
      slug: { _type: "slug", current: "a-journey-through-time" },
      author: { _ref: "author3", _type: "reference" },
      publishedAt: "2024-07-15T15:00:00Z",
    },
    {
      _id: "post4",
      _type: "post",
      title: "The Future of Space Exploration",
      slug: { _type: "slug", current: "the-future-of-space-exploration" },
      author: { _ref: "author4", _type: "reference" },
      publishedAt: "2024-06-20T08:00:00Z",
    },
    {
      _id: "post5",
      _type: "post",
      title: "Discovering Ancient Civilizations",
      slug: { _type: "slug", current: "discovering-ancient-civilizations" },
      author: { _ref: "author5", _type: "reference" },
      publishedAt: "2024-05-10T12:30:00Z",
    },
  ]);

	useEffect(() => {
		console.log("Mounted");
    function generateSearchableDataSet(
      data: any[],
      searchableField: string,
      idField: string
		): string[] | string {
      if (!data.length) {
        return "No data provided";
      }
      if (!searchableField) {
        return "No searchable field provided";
      }
      if (!idField) {
        return "No ID field provided";
      }

      const searchIndex = new Map();
      const mainDataIndex = new Map();

      // Generate searchable string dataset
      const dataSet = data.map((item) => {
        const itemSearchableField = item[searchableField];

        // Generate index (overriding duplicates)
        searchIndex.set(itemSearchableField, item[idField]);
        mainDataIndex.set(item[idField], item);

        return itemSearchableField.toString();
      }) as string[];

      if (!dataSet.length) {
        return "No dataset could be compiled";
      }

      // Set the indices
      setSearchIndex(searchIndex);
      setMainDataIndex(mainDataIndex);

			return dataSet;
    }

    // const dataSet = generateSearchableDataSet(mainDataSet, "title", "_id");

    // if (typeof dataSet === "string") {
    //   console.error(dataSet);
    // }

		// setSearchableDataSet(dataSet as string[]);
		
		return () => {
			console.log("Unmounted");
		}
  }, []);

  function executeSearch(
    fuzzy: uFuzzy,
    mainDataSet: any[],
    mainDataIndex: Map<string, any>,
    stringDataSet: string[],
    searchIndex: Map<string, string>,
    searchString: string
  ) {
    const resultIndices = fuzzy.search(stringDataSet, searchString)[2] ?? [];
    const searchResults: any[] = [];
    for (let i = 0; i < resultIndices.length; ++i) {
      const retrievedIndexID = searchIndex.get(stringDataSet[resultIndices[i]]);
      if (retrievedIndexID) {
        const objectData = mainDataSet[mainDataIndex.get(retrievedIndexID)];
        if (objectData) {
          searchResults.push(objectData);
        }
      }
    }
    return searchResults;
  }

  const [searchResults, setSearchResults] = useState<string[]>([]);

  return (
    <>
      <div className="flex flex-col top-0 w-full">
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
              mainDataSet,
              mainDataIndex,
              searchableDataSet,
              searchIndex,
              e.target.value
            );
            setSearchResults(results);
          }}
        />
      </div>
      <div>
        {searchResults.map((res) => {
          return <div key={res}>{res}</div>;
        })}
      </div>
    </>
  );
}

export default Index;
