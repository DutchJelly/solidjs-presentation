import { cards } from "../services/deckService";

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
