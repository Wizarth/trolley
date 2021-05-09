import React from 'react';
import Image from 'next/image';

import {boardHeight} from '../Board';

import type {Card as CardT} from '../types';

type ParamsT = {
  card: CardT;
  scaling?: number;
}

export default function Card({card, scaling = 1.0}: ParamsT) {
  const src = `/trolley/${card.deck}/${card.text}.png`;
  return <Image src={src} alt={card.text} width={300*scaling} height={(boardHeight/2) * scaling}/>;
}
