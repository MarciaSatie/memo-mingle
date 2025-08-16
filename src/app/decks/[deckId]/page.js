import AddCard_BTN from "@/components/cards/AddCard_BTN";

export default async function DeckPage({ params }) {
  const { deckId } = await params;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Deck: {deckId}</h1>
      <AddCard_BTN deckId={deckId} />
      <p>This is where the cards for this deck will appear.</p>
    </div>
  );
}
