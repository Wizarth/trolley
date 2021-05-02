import React from 'react';
import Image from 'next/image';

import {boardHeight} from '../Board';

import type {Card as CardT} from '../types';

type ParamsT = {
  card: CardT;
}

export default function Card({card}: ParamsT) {
  const src = `/trolley/${card.deck}/${card.text}.png`;
  return <Image src={src} alt={card.text} width={300} height={boardHeight/2}/>;
}
