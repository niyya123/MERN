import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const app = initializeApp ({
  apiKey: "AIzaSyBM-ClQXWPD_hYj6vwkxyzyvKjLu8loeg4",
  authDomain: "dgis-33b4f.firebaseapp.com",
  projectId: "dgis-33b4f",
  storageBucket: "dgis-33b4f.appspot.com",
  messagingSenderId: "247677229740",
  appId: "1:247677229740:web:f5c2cb2aa072afe81bdd09"
});

const storage = getStorage(app);
export default storage;