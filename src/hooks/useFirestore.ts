import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const useFirestore = (collectionName: string) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all documents in collection
  useEffect(() => {
    try {
      const collectionRef = collection(db, collectionName)
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setData(docs)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data')
      setLoading(false)
    }
  }, [collectionName])

  // Add document
  const addDocument = async (payload: any) => {
    try {
      setError(null)
      const collectionRef = collection(db, collectionName)
      const docRef = await addDoc(collectionRef, {
        ...payload,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding document')
      throw err
    }
  }

  // Update document
  const updateDocument = async (docId: string, payload: any) => {
    try {
      setError(null)
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        ...payload,
        updatedAt: new Date().toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating document')
      throw err
    }
  }

  // Delete document
  const deleteDocument = async (docId: string) => {
    try {
      setError(null)
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting document')
      throw err
    }
  }

  return { data, loading, error, addDocument, updateDocument, deleteDocument }
}
