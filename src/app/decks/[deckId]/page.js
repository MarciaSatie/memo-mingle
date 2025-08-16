export default function DeckPage({ params }) {
  // "deckId" comes from the URL segment: /decks/react-basics -> params.deckId === "react-basics"
  const { deckId } = params;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Deck: {deckId}</h1>
      <p>This is where the cards for this deck will appear.</p>
      <p className="text-sm opacity-70">
        Tip: your sidebar links should point to /decks/&lt;id-or-slug&gt;.
      </p>
    </div>
  );
}
