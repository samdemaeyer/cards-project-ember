import Ember from 'ember';
import flatten from 'cards-project-ember/utils/flatten';

const { Controller, computed } = Ember

export default Controller.extend({
  flatStyle: true,
  groupedAndSorted: false,
  shuffle: false,
  suits: ['♥', '♠', '♦', '♣'],
  pickedCards: [],
  hideCards: false,

  // lifesycle hooks
  init() {
    this.send('flattenAndSort');
  },

  // CP's
  cardsAreGrouped: computed.equal('defaultCards.length', 4),

  groupedCards: computed(function() {
    return this.suits.map((suit) => {
      let cards = [];
      for (let i = 0; i < 13; i++) {
        let value = i + 1;
        if (value === 11) {
          value = 'J';
        }
        if (value === 12) {
          value = 'Q';
        }
        if (value === 13) {
          value = 'K';
        }
        cards.push({ suit, value, flat: false });
      }
      cards.push(cards.shift());
      return cards;
    });
  }),

  actions: {
    shuffleCards() {
      let chuffledCards = this._shuffleCards(flatten(this.get('defaultCards'))).map((card, i) => {
        card.index = i;
        return card;
      });
      this.set('defaultCards', chuffledCards);
    },

    flattenAndSort() {
      this.set('defaultCards', flatten(this.get('groupedCards')).map((card, i) => {
        card.index = i;
        return card;
      }));
    },

    sortCards() {
      if (this.get('cardsAreGrouped')) {
        this.send('flattenAndSort');
      } else {
        this.setProperties({
          flatStyle: true,
          pickedCards: [],
          defaultCards: this.get('groupedCards')
        });
      }
    },

    alignCards() {
      if (this.get('cardsAreGrouped')) {
        this.send('flattenAndSort');
      }
      this.toggleProperty('flatStyle');
    },

    toggleHideCards() {
      this.toggleProperty('hideCards');
    },

    pickCard(card) {
      this.set('defaultCards', this.get('defaultCards').removeObject(card));
      this.set('pickedCards', [...this.get('pickedCards'), card]);
    },

    returnCard(card) {
      this.set('pickedCards', this.get('pickedCards').removeObject(card));
      this.set('defaultCards', [card, ...this.get('defaultCards')]);
    },

    sortPickedCards() {
      this.set('pickedCards', this.get('pickedCards').sortBy('value'));
    }
  },

  // Methods
  _shuffleCards(cards) {
    let currentIndex = cards.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }

    return cards;
  }
});
