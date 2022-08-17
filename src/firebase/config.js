import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBc7c30MKGUrRfCUlWqEnvC922yZUEpvqg',
  authDomain: 'meropiso.firebaseapp.com',
  projectId: 'meropiso',
  storageBucket: 'meropiso.appspot.com',
  messagingSenderId: '483941405021',
  appId: '1:483941405021:web:f631282dda497074d618b4',
};

//init firebase
const app = initializeApp(firebaseConfig);

//init service
const projectFirestore = getFirestore(app);
const projectAuth = getAuth(app);

//timestamp
const projectTimestamp = Timestamp;

export { projectFirestore, projectAuth, projectTimestamp };
