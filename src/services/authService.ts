import { auth, db, googleProvider, facebookProvider, signInWithPopup, signOut, isMockMode } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  totalXP: number;
  streak: number;
  gems: number;
  selectedCourseId: string;
  learningLevel: 'beginner' | 'basic' | 'pro';
  lastActive: string;
  createdAt: string;
}

const MOCK_USER: UserProfile = {
  uid: 'mock-user-123',
  displayName: 'Lingo Explorer',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
  email: 'learner@example.com',
  totalXP: 1250,
  streak: 5,
  gems: 450,
  selectedCourseId: 'korean',
  learningLevel: 'beginner',
  lastActive: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncUserProfile = async (user: FirebaseUser | { uid: string; displayName?: string | null; photoURL?: string | null; email?: string | null }): Promise<UserProfile> => {
  if (isMockMode || !db) {
    const stored = localStorage.getItem('lingo_mock_user');
    if (stored) return JSON.parse(stored);
    const newUser = { ...MOCK_USER, uid: user.uid, displayName: user.displayName || MOCK_USER.displayName, email: user.email || MOCK_USER.email };
    localStorage.setItem('lingo_mock_user', JSON.stringify(newUser));
    return newUser;
  }

  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Learner',
        photoURL: user.photoURL || '',
        email: user.email || '',
        totalXP: 0,
        streak: 0,
        gems: 0,
        selectedCourseId: 'korean', // Default
        learningLevel: 'beginner',
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }

    return userSnap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  if (isMockMode || !auth) {
    const mockUser = { uid: 'google-mock', displayName: 'Google Learner', email: 'google@example.com' };
    localStorage.setItem('lingo_mock_auth', JSON.stringify(mockUser));
    window.dispatchEvent(new Event('storage')); // Trigger update
    return await syncUserProfile(mockUser);
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await syncUserProfile(result.user);
  } catch (error) {
    console.error('Google Login Error:', error);
    throw error;
  }
};

export const loginWithFacebook = async () => {
  if (isMockMode || !auth) {
    const mockUser = { uid: 'fb-mock', displayName: 'Facebook Learner', email: 'fb@example.com' };
    localStorage.setItem('lingo_mock_auth', JSON.stringify(mockUser));
    window.dispatchEvent(new Event('storage'));
    return await syncUserProfile(mockUser);
  }
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return await syncUserProfile(result.user);
  } catch (error) {
    console.error('Facebook Login Error:', error);
    throw error;
  }
};

export const updateCourse = async (userId: string, courseId: string, level: string = 'beginner') => {
  if (isMockMode || !db) {
    const stored = localStorage.getItem('lingo_mock_user');
    if (stored) {
      const user = JSON.parse(stored);
      user.selectedCourseId = courseId;
      user.learningLevel = level;
      localStorage.setItem('lingo_mock_user', JSON.stringify(user));
    }
    return;
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, { 
      selectedCourseId: courseId,
      learningLevel: level 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
};

export const logout = () => {
  if (isMockMode) {
    localStorage.removeItem('lingo_mock_auth');
    window.dispatchEvent(new Event('storage'));
    return Promise.resolve();
  }
  return auth ? signOut(auth) : Promise.resolve();
};
