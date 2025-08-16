import AddCard_BTN from "@/components/cards/AddCard_BTN";
import ShowCards from "@/components/cards/ShowCards";

export default async function DeckPage({ params }) {
  const { deckId } = await params;   // ✅ params must be awaited

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Deck: {deckId}</h1>
      <AddCard_BTN deckId={deckId} />
      <ShowCards deckId={deckId} />
    </div>
  );
}

