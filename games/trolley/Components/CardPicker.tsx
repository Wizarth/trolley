import React from 'react';

import Card from './Card';
import BoardArea from '../../../components/BoardArea';

import styles from './style.module.sass';
import {Card as CardT, DeckType} from '../types';

type ParamsT = {
  hand: CardT[];
  deck: DeckType;
  callback: (cardIndex: number) => void;
}

export default function CardPicker({hand, deck, callback}: ParamsT) {
  const cards = hand.map(
      (card, key) => <button key={key} onClick={()=>callback(key)}>
        <Card card={card} />
      </button>,
  );
  return <BoardArea className={`${styles.cardPickerArea} ${styles[deck]}`} styles={styles}>
    {cards}
  </BoardArea>;
};
