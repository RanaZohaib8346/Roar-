import { db, auth, isMockMode } from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  increment,
  onSnapshot
} from 'firebase/firestore';

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

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  xp: number;
  type: 'vocabulary' | 'grammar' | 'practice';
  level?: string;
}

export interface UserProgressData {
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export const fetchLessons = async (courseId: string): Promise<Lesson[]> => {
  if (isMockMode || !db) return [];
  const path = 'lessons';
  try {
    const q = query(collection(db, path), where('courseId', '==', courseId), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const completeLesson = async (userId: string, lessonId: string, xpGain: number) => {
  if (isMockMode || !db) {
    const progressKey = `lingo_progress_${userId}`;
    const stored = localStorage.getItem(progressKey) || '{}';
    const progress = JSON.parse(stored);
    progress[lessonId] = true;
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Update local profile XP
    const profileKey = 'lingo_mock_user';
    const profileStored = localStorage.getItem(profileKey);
    if (profileStored) {
      const profile = JSON.parse(profileStored);
      profile.totalXP = (profile.totalXP || 0) + xpGain;
      profile.lastActive = new Date().toISOString();
      localStorage.setItem(profileKey, JSON.stringify(profile));
    }

    window.dispatchEvent(new Event('storage'));
    return;
  }

  const progressPath = `users/${userId}/progress/${lessonId}`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', lessonId);
    await setDoc(progressRef, {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date().toISOString()
    });

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalXP: increment(xpGain),
      lastActive: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, progressPath);
  }
};

export const subscribeToProgress = (userId: string, callback: (progress: Record<string, boolean>) => void) => {
  if (isMockMode || !db) {
    const progressKey = `lingo_progress_${userId}`;
    const update = () => {
      const stored = localStorage.getItem(progressKey) || '{}';
      callback(JSON.parse(stored));
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }

  const path = `users/${userId}/progress`;
  return onSnapshot(collection(db, 'users', userId, 'progress'), (snapshot) => {
    const progress: Record<string, boolean> = {};
    snapshot.docs.forEach(doc => {
      progress[doc.id] = doc.data().completed;
    });
    callback(progress);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};
