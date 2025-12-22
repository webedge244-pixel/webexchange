// hooks/useCollectionData.ts

import { fetchAllDocuments } from "@/lib/firebaseUtils";
import { useState, useEffect } from "react";

export const useCollectionData = (collectionName: string) => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!collectionName) return; // avoid fetching with no name

		const loadData = async () => {
			setLoading(true);
			setError(null);
			try {
				const fetchedData = await fetchAllDocuments(collectionName);
				setData(fetchedData);
			} catch (err: any) {
				setError(err.message || "Something went wrong while fetching data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [collectionName]);

	return { data, loading, error };
};