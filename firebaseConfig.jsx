// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAlU4sdFbgDgPXosB4Ixw6_szPqYUV3Lhw',
  authDomain: 'greenzoneshipperlocation.firebaseapp.com',
  databaseURL: 'https://greenzoneshipperlocation-default-rtdb.firebaseio.com',
  projectId: 'greenzoneshipperlocation',
  storageBucket: 'greenzoneshipperlocation.firebasestorage.app',
  messagingSenderId: '930489238593',
  appId: '1:930489238593:web:44e6e538840f09a6bf32c0',
  measurementId: 'G-1MB0LGES8H',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
