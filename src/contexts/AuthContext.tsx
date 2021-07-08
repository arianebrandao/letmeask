import { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firebase } from '../services/firebase';

type UserType = {
  id: string,
  name: string,
  avatar: string
}
type AuthContextType = {
  user: UserType | undefined;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
}
type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const { displayName, photoURL, uid } = user;

        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    if(result.user){
      const { displayName, photoURL, uid } = result.user;

      if(!displayName || !photoURL){
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    }
  }

  async function signOutWithGoogle(){
    await auth.signOut();
  }

  return (
    <AuthContext.Provider value={ {user, signInWithGoogle, signOutWithGoogle} }>
      {props.children}
    </AuthContext.Provider>
  );
}
