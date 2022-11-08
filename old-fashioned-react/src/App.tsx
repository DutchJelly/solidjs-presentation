import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const cards = [
  "AD",
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "0D",
  "JD",
  "QD",
  "KD",
];

//We need this because the api does not include queens for some reason :P
const allCards = [
  "9S",
  "7D",
  "AH",
  "AD",
  "JC",
  "8C",
  "4S",
  "6D",
  "6S",
  "7S",
  "3S",
  "5C",
  "2C",
  "2D",
  "9C",
  "KD",
  "0C",
  "5H",
  "AC",
  "0D",
  "7H",
  "4C",
  "7C",
  "3H",
  "0S",
  "9H",
  "KH",
  "3C",
  "8S",
  "4H",
  "6C",
  "5S",
  "5D",
  "8H",
  "6H",
  "AS",
  "KS",
  "JD",
  "2S",
  "8D",
  "9D",
  "KC",
  "JS",
  "4D",
  "2H",
  "0H",
  "3D",
  "JH",
  "QS",
  "QD",
  "QC",
  "QH",
];

type CardCode = typeof cards[number];

type Card = {
  code: CardCode;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: number;
  suit: string;
};

const numberStrings = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const safeNameCards = cards.map((card) => {
  if (!isNaN(+card.charAt(0))) {
    return numberStrings[+card.charAt(0)] + card.substring(1);
  }
  return card;
});

type GameState = "pick" | "higher" | "lower" | "correct" | "incorrect";

const BACK_IMAGE_URL = "https://deckofcardsapi.com/static/img/back.png";

const openDeck = () => {
  return fetch("https://deckofcardsapi.com/api/deck/new/shuffle", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

const draw = (deckId?: string) => {
  if (!deckId) return;
  return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

function App() {
  const [state, setState] = useState<GameState>("pick");
  const [pickedCards, setPickedCards] = useState<CardCode[]>([]);

  const deckId = useRef();
  const peekedCard = useRef<Card>();

  const remainingCards = useMemo(() => {
    const cardCounts = Array(cards.length).fill(0);
    pickedCards.forEach((card) => {
      const matchedCardIndex = cards.findIndex(
        (c) => card.charAt(0) === c.charAt(0)
      );
      cardCounts[matchedCardIndex]++;
    });
    return cardCounts
      .map((count, i) => (count < 4 ? cards[i] : undefined))
      .filter((x) => x);
  }, [pickedCards]);

  const middleCardImage = useMemo(() => {
    if (state === "pick" || state === "higher" || state === "lower") {
      return BACK_IMAGE_URL;
    }
    return peekedCard.current?.image;
  }, [state]);

  const peek = async () => {
    const card = (await draw(deckId.current)).cards[0];
    peekedCard.current = card;
    console.log(card);
    return card as Card;
  };

  useEffect(() => {
    openDeck().then((deck) => {
      console.log(`Opened deck id ${deck.deck_id}`);
      deckId.current = deck.deck_id;
    });
  }, []);

  const actionLock = useRef(false);
  const handleClick = async (card: string) => {
    if (!deckId.current || actionLock.current || !remainingCards?.length)
      return;
    actionLock.current = true;

    const chosenCardIndex = cards.findIndex((c) => c === card);

    switch (state) {
      case "correct":
      case "incorrect":
      case "pick":
        {
          const peekedCard = await peek();
          const peekedCardIndex = cards.findIndex(
            (c) => c.charAt(0) === peekedCard.code.charAt(0)
          );
          setState(
            peekedCardIndex > chosenCardIndex
              ? "higher"
              : peekedCardIndex < chosenCardIndex
              ? "lower"
              : "correct"
          );
          if (peekedCardIndex === chosenCardIndex) {
            setPickedCards((pickedCards) => [...pickedCards, peekedCard!.code]);
          }
        }
        break;
      case "higher":
      case "lower":
        {
          const peekedCardIndex = cards.findIndex(
            (c) => c.charAt(0) === peekedCard.current!.code.charAt(0)
          );
          setState(
            peekedCardIndex === chosenCardIndex ? "correct" : "incorrect"
          );
          setPickedCards((pickedCards) => [
            ...pickedCards,
            peekedCard.current!.code,
          ]);
        }
        break;
    }
    actionLock.current = false;
  };

  useEffect(() => {
    if (state !== "correct" && state !== "incorrect") return;
    const timeout = setTimeout(() => {
      setState("pick");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    console.log(pickedCards);
  });

  return (
    <div className="game-grid w-screen h-screen p-5 max-w-3xl mx-auto">
      <h3
        className="text-white text-center text-4xl"
        style={{ gridArea: "header" }}
      >
        Hoger of lager?
        <br />
        {!remainingCards.length
          ? "game finished"
          : state === "pick"
          ? "Pick a card"
          : state === "correct"
          ? "Correct!"
          : state === "higher"
          ? "Guess higher"
          : state === "incorrect"
          ? "Incorrect"
          : state === "lower"
          ? "Guess lower"
          : undefined}
      </h3>
      <div className="py-2" style={{ gridArea: "middle" }}>
        <img className="max-h-full max-w-full mx-auto" src={middleCardImage} />
      </div>

      {cards.map((item, i) => (
        <div
          key={item}
          id={item}
          className={`h-full w-full ${
            remainingCards.includes(item) ? "" : "hidden"
          }`}
          style={{ gridArea: safeNameCards[i] }}
        >
          <img
            onClick={() => handleClick(item)}
            className="max-h-full max-w-full mx-auto hover:scale-110 hover:cursor-pointer hover:z-10 transition-transform"
            src={`https://deckofcardsapi.com/static/img/${item}.png`}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
