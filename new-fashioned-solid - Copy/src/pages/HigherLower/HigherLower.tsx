import { useEffect, useMemo, useRef, useState } from "react";
import {
  cards,
  alphaNamedCards,
  BACK_IMAGE_URL,
  draw,
  openDeck,
} from "../../shared/services/deckService";
import type { CardCode, Card } from "../../shared/types/card";

import { useNavigate } from "react-router-dom";

import "./HigherLower.css";

type GameState = "pick" | "higher" | "lower" | "correct" | "incorrect";

type RemainingCardCounts = {
  [key: CardCode]: number;
};

const HigherLower = () => {
  const [state, setState] = useState<GameState>("pick");
  const [remainingCards, setRemainingCards] = useState<RemainingCardCounts>(
    Object.fromEntries(cards.map((c) => [c, 4]))
  );

  const navigate = useNavigate();

  const deckId = useRef();
  const peekedCard = useRef<Card>();

  const gameFinished = useMemo(() => {
    return !Object.values(remainingCards).find((r) => r > 0);
  }, [remainingCards]);

  useEffect(() => {
    if (!gameFinished) return;

    const timeout = setTimeout(() => {
      navigate("/victory");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [gameFinished, navigate]);

  const middleCardImage = useMemo(() => {
    if (state === "pick" || state === "higher" || state === "lower") {
      return BACK_IMAGE_URL;
    }
    return peekedCard.current?.image;
  }, [state]);

  const peek = async () => {
    const card = (await draw(deckId.current)).cards[0];
    peekedCard.current = card;
    return card as Card;
  };

  useEffect(() => {
    openDeck().then((deck) => {
      deckId.current = deck.deck_id;
    });
  }, []);

  const actionLock = useRef(false);
  const handleClick = async (card: string) => {
    if (!deckId.current || actionLock.current || gameFinished) return;
    actionLock.current = true;

    const chosenCardIndex = cards.findIndex((c) => c === card);

    if (state === "correct" || state === "incorrect" || state === "pick") {
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
        setRemainingCards((remaining) => {
          const key = peekedCard.code.charAt(0) + "D";
          console.log(key);
          return { ...remaining, ...{ [key]: remaining[key] - 1 } };
        });
      }
    } else if (state === "higher" || state === "lower") {
      const peekedCardIndex = cards.findIndex(
        (c) => c.charAt(0) === peekedCard.current!.code.charAt(0)
      );
      setState(peekedCardIndex === chosenCardIndex ? "correct" : "incorrect");
      setRemainingCards((remaining) => {
        const key = peekedCard.current!.code.charAt(0) + "D";
        return { ...remaining, ...{ [key]: remaining[key] - 1 } };
      });
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

  return (
    <div className="game-grid w-screen h-screen p-5 max-w-3xl mx-auto">
      <h3
        className="text-white text-center text-4xl"
        style={{ gridArea: "header" }}
      >
        Hoger of lager?
        <br />
        {gameFinished
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
            remainingCards[item] > 0 ? "" : "hidden"
          }`}
          style={{ gridArea: alphaNamedCards[i] }}
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
};

export default HigherLower;
