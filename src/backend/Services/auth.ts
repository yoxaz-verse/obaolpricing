import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { auth } from "../database";


export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

//login function
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    return {
      user,
      status: true,
    }
  } catch (error: any) {
    console.log(error);
    return {
      status: false,
      message: error.message,

    }
  }
}

//logout function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

