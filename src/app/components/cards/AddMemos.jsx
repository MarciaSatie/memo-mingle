// src/app/page.js (for App Router)
// Or src/pages/index.js (for Pages Router)

'use client'; // Required for client-side components in Next.js App Router

import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust path based on where you put firebase.js
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function HomePage() {
  const [newMemo, setNewMemo] = useState('');
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to add a new memo
  const addMemo = async (e) => {
    e.preventDefault();
    if (!newMemo.trim()) return; // Don't add empty memos

    try {
      await addDoc(collection(db, 'memos'), {
        text: newMemo,
        createdAt: new Date().toISOString(), // Store as ISO string
      });
      setNewMemo(''); // Clear the input
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Failed to add memo.');
    }
  };

  // Effect to fetch and listen for real-time updates to memos
  useEffect(() => {
    if (!db) {
      console.warn('Firestore database is not initialized.');
      setLoading(false);
      setError('Firestore not initialized.');
      return;
    }

    const q = query(collection(db, 'memos'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const memosData = [];
      querySnapshot.forEach((doc) => {
        memosData.push({ id: doc.id, ...doc.data() });
      });
      setMemos(memosData);
      setLoading(false);
      setError(null); // Clear any previous errors
    }, (err) => {
      console.error("Error fetching memos: ", err);
      setError('Failed to load memos.');
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <div className="p-4 text-center">Loading memos...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">My Memo App</h1>

      <form onSubmit={addMemo} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-8">
        <label htmlFor="newMemo" className="block text-gray-700 text-sm font-bold mb-2">
          New Memo:
        </label>
        <textarea
          id="newMemo"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          placeholder="What's on your mind?"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 h-24 resize-y"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Memo
        </button>
      </form>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Memos:</h2>
        {memos.length === 0 ? (
          <p className="text-gray-600">No memos yet. Add one above!</p>
        ) : (
          <ul className="space-y-4">
            {memos.map((memo) => (
              <li key={memo.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-800 text-lg break-words">{memo.text}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {memo.createdAt && new Date(memo.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
