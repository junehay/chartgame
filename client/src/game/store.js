import { atom } from 'recoil';

export const priceState = atom({
  key: 'priceState',
  default: 0
});

export const volumeState = atom({
  key: 'volumeState',
  default: 0
});

export const nowPriceState = atom({
  key: 'nowPriceState',
  default: 0
});

export const buyPriceState = atom({
  key: 'buyPriceState',
  default: 0
});

export const stocksState = atom({
  key: 'stocksState',
  default: 0
});

export const gainPriceState = atom({
  key: 'gainPriceState',
  default: 0
});

export const gainPercentState = atom({
  key: 'gainPercentState',
  default: 0
});

export const nextButtonState = atom({
  key: 'nextButtonState',
  default: ''
});

export const winCountState = atom({
  key: 'winCountState',
  default: 0
});

export const loseCountState = atom({
  key: 'loseCountState',
  default: 0
});

export const accGainPriceState = atom({
  key: 'accGainPriceState',
  default: 0
});

export const accountState = atom({
  key: 'accountState',
  default: 0
});

export const timeState = atom({
  key: 'timeState',
  default: 30
});
