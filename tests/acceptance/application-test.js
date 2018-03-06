import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL, findAll, click } from '@ember/test-helpers';

module('Acceptance | Application', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting the application', async assert => {
    let orderedCardsContend = [
      "2♥3♥4♥5♥6♥7♥8♥9♥10♥J♥Q♥K♥1♥",
      "2♠3♠4♠5♠6♠7♠8♠9♠10♠J♠Q♠K♠1♠",
      "2♦3♦4♦5♦6♦7♦8♦9♦10♦J♦Q♦K♦1♦",
      "2♣3♣4♣5♣6♣7♣8♣9♣10♣J♣Q♣K♣1♣"
    ];
    await visit('/');

    assert.equal(currentURL(), '/', 'Correct route rendered');
    assert.equal(findAll('.magician-cards .card').length, 52, '52 cards rendered');
    assert.equal(findAll('.buttons-wrapper .btn').length, 4, '4 buttons rendered');
    assert.equal(orderedCardsContend.join(''), _mapCardValues(findAll('.magician-cards .card')),
      'Cards are correctly ordered by default');
    assert.ok(findAll('.magician-cards .card')[0].classList.contains('absolute'),
      'Cards are positioned absolute by default');
    assert.equal(findAll('.magician-cards .card')[1].style.left, '40px', 'Cards are inline positioned by default');
    assert.ok(findAll('.pick-card-info').length, 'Pick a card info rendered');
    assert.equal(findAll('.subtitle')[0].innerText, 'Magician\'s cards:', 'Correct subtitle rendered');

    await click(findAll('.magician-cards .card')[0]); // Pick '2♥'
    await click(findAll('.magician-cards .card')[3]); // Pick '6♥'
    await click(findAll('.magician-cards .card')[12]); // Pick '3♠'
    assert.equal(findAll('.magician-cards .card').length, 49, '49 magician\'s cards rendered');
    assert.equal(findAll('.picked .card').length, 3, '3 picked cards rendered');
    assert.equal(_mapCardValues(findAll('.picked .card')), '2♥6♥3♠', 'Correct cards picked');

    await click('[data-test-selector="sort-selected"]');
    assert.equal(_mapCardValues(findAll('.picked .card')), '2♥3♠6♥', 'Picked cards are sorted');

    await click(findAll('.picked .card')[0]); // Return '2♥'
    await click(findAll('.picked .card')[0]); // Return '3♠'
    await click(findAll('.picked .card')[0]); // Return '6♥'
    assert.equal(findAll('.magician-cards .card').length, 52, 'All magicians cards returned');
    assert.notOk(findAll('.picked .card').length, 'No picked cards rendered');
    assert.equal(findAll('[data-test-selector="align-cards"]')[0].innerText, 'SHOW ALL CARDS',
      'Correct text in btn rendered');

    await click('[data-test-selector="align-cards"]');
    assert.notOk(findAll('.magician-cards .card')[0].classList.contains('absolute'),
      'Cards are not positioned absolute');
    assert.equal(findAll('.magician-cards .card')[1].attributes.style, undefined,
      'Cards don\' have inline positioning');
    assert.equal(findAll('[data-test-selector="align-cards"]')[0].innerText, 'ALIGN CARDS',
      'Correct text in btn rendered');

    await click('[data-test-selector="align-cards"]');
    assert.ok(findAll('.magician-cards .card')[0].classList.contains('absolute'),
      'Cards are positioned absolute again');
    assert.equal(findAll('.magician-cards .card')[1].style.left, '40px', 'Cards are inline positioned again');
    assert.equal(findAll('[data-test-selector="sort-cards"]')[0].innerText, 'SORT AND GROUP CARDS',
      'Correct text in btn rendered');

    await click('[data-test-selector="sort-cards"]');
    assert.notOk(findAll('.pick-card-info').length, 'Pick a card info rendered');
    assert.equal(_mapCardValues(findAll('.magician-cards .cards-wrapper')[0].querySelectorAll('.card')),
      orderedCardsContend[0], 'Cards are correctly ordered by ♥');
    assert.equal(_mapCardValues(findAll('.magician-cards .cards-wrapper')[1].querySelectorAll('.card')),
      orderedCardsContend[1], 'Cards are correctly ordered by ♠');
    assert.equal(_mapCardValues(findAll('.magician-cards .cards-wrapper')[2].querySelectorAll('.card')),
      orderedCardsContend[2], 'Cards are correctly ordered by ♦');
    assert.equal(_mapCardValues(findAll('.magician-cards .cards-wrapper')[3].querySelectorAll('.card')),
      orderedCardsContend[3], 'Cards are correctly ordered by ♣');
    assert.equal(findAll('[data-test-selector="sort-cards"]')[0].innerText, 'SORT AND ALIGN CARDS',
      'Correct text in btn rendered');

    await click('[data-test-selector="sort-cards"]');
    assert.ok(findAll('.pick-card-info').length, 'Pick a card info rendered');
    assert.equal(_mapCardValues(findAll('.magician-cards .card')), orderedCardsContend.join(''),
      'Cards are correctly ordered again');
    assert.ok(findAll('.magician-cards .card')[0].classList.contains('absolute'),
      'Cards are positioned absolute again');
    assert.equal(findAll('.magician-cards .card')[1].style.left, '40px', 'Cards are inline positioned again');

    await click('[data-test-selector="shuffle-cards"]');
    assert.notEqual(_mapCardValues(findAll('.magician-cards .card')), orderedCardsContend.join(''),
      'Cards are shuffled');
    assert.equal(findAll('[data-test-selector="show-hide-cards"]')[0].innerText, 'HIDE CARDS',
      'Correct text in btn rendered');

    await click('[data-test-selector="show-hide-cards"]');
    assert.equal(findAll('.hidden-card-bg').length, 52 ,'All cards display hidden');
    assert.equal(findAll('[data-test-selector="show-hide-cards"]')[0].innerText, 'SHOW CARDS',
      'Correct text in btn rendered');
  });

  let _mapCardValues = (cards) => {
    let cardValues = [];
    cards.forEach(card => {
      let value = card.querySelector('.value').innerText;
      let suit = card.querySelector('.symbol').innerText;
      cardValues.push(`${value}${suit}`);
    });
    return cardValues.join('');
  };
});
