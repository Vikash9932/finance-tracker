import { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      //signup user
      const res = await createUserWithEmailAndPassword(
        projectAuth,
        email,
        password
      );
      if (!res) {
        throw new Error('Could not complete signup');
      }

      //add display name to user
      await updateProfile(res.user, { displayName });

      //dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      // Update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled) {
        setIsPending(false);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
