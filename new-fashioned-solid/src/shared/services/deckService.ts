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

const alphaNamedCards = cards.map((card) => {
  if (!isNaN(+card.charAt(0))) {
    return numberStrings[+card.charAt(0)] + card.substring(1);
  }
  return card;
});

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

export { openDeck, draw, cards, alphaNamedCards, BACK_IMAGE_URL };
