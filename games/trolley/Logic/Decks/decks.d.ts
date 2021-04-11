import type {InnocentCard, GuiltyCard, ModifierCard} from './games/trolley/types';

declare module 'guilty.json' {
  const cards: GuiltyCard[];
  export default cards;
}

declare module 'innocent.json' {
  const cards: InnocentCard[];
  export default cards;
}

declare module 'modifier.json' {
  const cards: ModifierCard[];
  export default cards;
}
