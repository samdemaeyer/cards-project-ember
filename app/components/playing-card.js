import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import isEven from 'cards-project-ember/utils/is-even';

export default Component.extend({
  hideCards: false,
  attributeBindings: ['style'],
  classNameBindings: ['card.suit', 'flatStyle:absolute', 'hideCards:hidden-card-bg'],
  classNames: ['card'],

  click() {
    if (this.get('pickAction')) {
      this.get('pickAction')(this.get('card'));
    }
  },

  // CP's
  style: computed('flatStyle', 'cardIndex', function() {
    if (this.get('flatStyle')) {
      return htmlSafe(`left: ${this.get('cardIndex')*40}px;`);
    }
  }),

  isFaceCard: computed('card.value', function() {
    return typeof(this.get('card.value')) === 'string';
  }),

  suitsRows: computed('card.value', function() {
    let suitsRowArray = [];
    let suitsRows = 1;
    let cardValue = this.get('card.value');
    let hasOddRows = !isEven(cardValue);
    if (cardValue > 3) {
      suitsRows = 2;
      if (hasOddRows) {
        suitsRows = 3;
      }
    }
    for (let i = 0; i < suitsRows; i++) {
      let devider = 2;
      if (!isEven(i) && hasOddRows) {
        devider = 4;
      }
      let suitsPerCol = Math.floor(cardValue / devider);
      if (this.get('isFaceCard')) {
        suitsPerCol = 1;
      } else if (cardValue <= 3) {
        suitsPerCol = cardValue;
      }
      let suits = [];
      for (let colIndex = 0; colIndex < suitsPerCol; colIndex++) {
        suits.push(colIndex);
      }
      suitsRowArray.push(suits);
    }
    return suitsRowArray;
  })
});
