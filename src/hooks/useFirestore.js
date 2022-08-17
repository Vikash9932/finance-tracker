import { useReducer, useEffect, useState } from 'react';
import { projectFirestore, projectTimestamp } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, error: null, success: null };
    case 'ADDED_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        error: null,
        success: true,
      };
    case 'DELETED_DOCUMENT':
      return {
        document: null,
        isPending: false,
        error: null,
        success: true,
      };
    case 'ERROR':
      return {
        isPending: false,
        success: false,
        document: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (locCollection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  //only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  //add document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const createdAt = projectTimestamp.fromDate(new Date());
      const addedDocument = await addDoc(
        collection(projectFirestore, locCollection),
        {
          ...doc,
          createdAt,
        }
      );
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      });
    } catch (e) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: e.message,
      });
    }
  };

  //Delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      await deleteDoc(doc(projectFirestore, locCollection, id));
      dispatchIfNotCancelled({
        type: 'DELETED_DOCUMENT',
      });
    } catch (e) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: 'could not delete',
      });
    }
  };

  useEffect(() => {
    setIsCancelled(false);

    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, response };
};
