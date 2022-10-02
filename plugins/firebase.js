// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDgvPwGm83jK-SQW61Luwx8vaoqOcIos5Y',
  authDomain: 'odekake-54c4a.firebaseapp.com',
  projectId: 'odekake-54c4a',
  storageBucket: 'odekake-54c4a.appspot.com',
  messagingSenderId: '290798968689',
  appId: '1:290798968689:web:e727d5af828a09746d60d0',
  measurementId: 'G-3MB54WC9YQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default (context, inject) => {
  inject('firebase', app);
};
