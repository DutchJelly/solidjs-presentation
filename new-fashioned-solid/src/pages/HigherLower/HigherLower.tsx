import {
  createEffect,
  createMemo,
  createSignal,
  createResource,
  onCleanup,
  For,
} from "solid-js";
import {
  cards,
  alphaNamedCards,
  BACK_IMAGE_URL,
  draw,
  openDeck,
} from "../../shared/services/deckService";
import type { CardCode, Card } from "../../shared/types/card";
import { useNavigate } from "@solidjs/router";

import "./HigherLower.css";

type GameState = "pick" | "higher" | "lower" | "correct" | "incorrect";

type RemainingCardCounts = {
  [key: CardCode]: number;
};

const HigherLower = () => {
  const [state, setState] = createSignal<GameState>("pick");
  const [remainingCards, setRemainingCards] = createSignal<RemainingCardCounts>(
    Object.fromEntries(cards.map((c) => [c, 4]))
  );

  const navigate = useNavigate();

  let peekedCard: Card;

  const gameFinished = createMemo(() => {
    return !Object.values(remainingCards()).find((r) => r > 0);
  });

  createEffect(() => {
    if (!gameFinished()) return;

    const timeout = setTimeout(() => {
      navigate("/victory");
    }, 1000);

    return () => clearTimeout(timeout);
  });

  const middleCardImage = createMemo(() => {
    const currentState = state();
    if (
      currentState === "pick" ||
      currentState === "higher" ||
      currentState === "lower"
    ) {
      return BACK_IMAGE_URL;
    }
    return peekedCard.image;
  }, [state]);

  const peek = async () => {
    const card = (await draw(deckId())).cards[0];
    peekedCard = card;
    return card as Card;
  };

  const [deckId] = createResource("deck", async () =>
    openDeck().then((res) => res.deck_id)
  );

  let actionLock = false;
  const handleClick = async (card: string) => {
    const currentDeckId = deckId();
    if (!currentDeckId || actionLock || gameFinished()) return;
    actionLock = true;

    const chosenCardIndex = cards.findIndex((c) => c === card);
    const currentState = state();
    if (
      currentState === "correct" ||
      currentState === "incorrect" ||
      currentState === "pick"
    ) {
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
        setRemainingCards;

        setRemainingCards((remaining) => {
          const key = peekedCard.code.charAt(0) + "D";
          return { ...remaining, ...{ [key]: remaining[key] - 1 } };
        });
      }
    } else if (currentState === "higher" || currentState === "lower") {
      const peekedCardIndex = cards.findIndex(
        (c) => c.charAt(0) === peekedCard.code.charAt(0)
      );
      setState(peekedCardIndex === chosenCardIndex ? "correct" : "incorrect");
      setRemainingCards((remaining) => {
        const key = peekedCard.code.charAt(0) + "D";
        return { ...remaining, ...{ [key]: remaining[key] - 1 } };
      });
    }
    actionLock = false;
  };

  let timeout: number;
  createEffect(() => {
    clearTimeout(timeout);
    const currentState = state();
    if (currentState !== "correct" && currentState !== "incorrect") return;
    timeout = setTimeout(() => {
      setState("pick");
    }, 2000);
  });

  onCleanup(() => clearTimeout(timeout));

  return (
    <div class="game-grid w-screen h-screen p-5 max-w-3xl mx-auto">
      <h3 class="text-white text-center text-4xl" style="grid-area: header">
        Hoger of lager?
        <br />
        {gameFinished()
          ? "game finished"
          : state() === "pick"
          ? "Pick a card"
          : state() === "correct"
          ? "Correct!"
          : state() === "higher"
          ? "Guess higher"
          : state() === "incorrect"
          ? "Incorrect"
          : state() === "lower"
          ? "Guess lower"
          : undefined}
      </h3>
      <div class="py-2" style="grid-area: middle">
        <img class="max-h-full max-w-full mx-auto" src={middleCardImage()} />
      </div>

      <For each={cards}>
        {(card, i) => (
          <div
            id={card}
            class={`h-full w-full ${
              remainingCards()[card] > 0 ? "" : "hidden"
            }`}
            style={`grid-area: ${alphaNamedCards[i()]}`}
          >
            <img
              onClick={() => handleClick(card)}
              class="max-h-full max-w-full mx-auto hover:scale-110 hover:cursor-pointer hover:z-10 transition-transform"
              src={`https://deckofcardsapi.com/static/img/${card}.png`}
            />
          </div>
        )}
      </For>
    </div>
  );
};

export default HigherLower;
