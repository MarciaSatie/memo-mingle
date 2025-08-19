import AddCard_BTN from "@/components/cards/AddCard_BTN";
import ShowCards from "@/components/cards/ShowCards";
import { db } from "@/app/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default async function DeckPage({ params }) {
  const { deckId } = params; // ✅ no need for await, params is plain object

  // fetch deck info
  let deckName = deckId;
  try {
    const docRef = doc(db, "decks", deckId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      deckName = docSnap.data().name || deckSnap.data().title || deckId;
    }
  } catch (error) {
    console.error("Error fetching deck:", error);
  }

  return (
    <div className="pt-12 p-6 space-y-3">
      <h1 className="text-2xl font-bold">Deck: {deckName}</h1>
      <AddCard_BTN deckId={deckId} />
      <ShowCards deckId={deckId} />
    </div>
  );
}
