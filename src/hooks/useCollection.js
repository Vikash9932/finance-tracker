import { useEffect, useState, useRef } from 'react';
import { projectFirestore } from '../firebase/config';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

export const useCollection = (locCollection, _argQuery, _argOrder) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _argQuery is an array and is "different" on every function call
  const argQuery = useRef(_argQuery).current;
  const argOrder = useRef(_argOrder).current;

  useEffect(() => {
    let q = query(collection(projectFirestore, locCollection));

    if (argQuery) {
      if (argOrder) {
        q = query(
          collection(projectFirestore, locCollection),
          where(...argQuery),
          orderBy(...argOrder)
        );
      } else {
        q = query(
          collection(projectFirestore, locCollection),
          where(...argQuery)
        );
      }
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        //update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        setError('Could not fetch the data');
      }
    );

    //unsubscribe on unmount
    return () => unsubscribe();
  }, [locCollection, argQuery, argOrder]);

  return { documents, error };
};
