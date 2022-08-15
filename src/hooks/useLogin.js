import { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      //login user
      const res = await signInWithEmailAndPassword(
        projectAuth,
        email,
        password
      );
      //   console.log(res.user);
      if (!res) {
        throw new Error('Could not complete login');
      }

      //dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });
      // Update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      console.log(error.message);
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

  return { error, isPending, login };
};
