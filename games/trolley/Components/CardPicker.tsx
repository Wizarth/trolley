import React from 'react';

import Card from './Card';
import BoardArea from '../../../components/BoardArea';

import styles from './style.module.sass';
import {Card as CardT, DeckType} from '../types';

type ParamsT = {
  hand: CardT[];
  deck: DeckType;
  callback: (cardIndex: number) => void;
  cardChosen: null|number;
}

export default function CardPicker({hand, deck, callback, cardChosen}: ParamsT) {
  const cards = hand.map(
      (card, key) => {
        if (cardChosen === null) {
          return <button key={key} onClick={()=>callback(key)}>
            <Card card={card} />
          </button>;
        } else {
          if ( key === cardChosen ) {
            // TODO: Make this card bold or something
            return <Card card={card} scaling={1.2} />;
          } else {
            return <Card card={card} />;
          }
        }
      },
  );
  return <BoardArea className={`${styles.cardPickerArea} ${styles[deck]}`} styles={styles}>
    {cards}
  </BoardArea>;
};
