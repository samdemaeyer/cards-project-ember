import { test } from 'qunit';
import moduleForAcceptance from 'cards-project-ember/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Application');

test('visiting the application', assert => {
  let orderedCardsContend = ["2♥3♥4♥5♥6♥7♥8♥9♥10♥J♥Q♥K♥1♥", "2♠3♠4♠5♠6♠7♠8♠9♠10♠J♠Q♠K♠1♠", "2♦3♦4♦5♦6♦7♦8♦9♦10♦J♦Q♦K♦1♦", "2♣3♣4♣5♣6♣7♣8♣9♣10♣J♣Q♣K♣1♣"];
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', 'Correct route rendered');
    assert.equal(find('.magician-cards .card').length, 52, '52 cards rendered');
    assert.equal(find('.buttons-wrapper .btn').length, 4, '4 buttons rendered');
    assert.equal(orderedCardsContend.join(''), _mapCardValues(find('.magician-cards .card')), 'Cards are correctly ordered by default');
    assert.ok(find('.magician-cards .card:eq(0)').hasClass('absolute'), 'Cards are positioned absolute by default');
    assert.equal(find('.magician-cards .card:eq(1)').attr('style'), 'left: 40px;', 'Cards are inline positioned by default');
    assert.ok(find('.pick-card-info').length, 'Pick a card info rendered');
    assert.equal(find('.subtitle').text().trim(), 'Magician\'s cards:', 'Correct subtitle rendered');
    click('.magician-cards .card:eq(0)'); // Pick '2♥'
    click('.magician-cards .card:eq(3)'); // Pick '6♥'
    click('.magician-cards .card:eq(12)'); // Pick '3♠'
  });

  andThen(() => {
    assert.equal(find('.magician-cards .card').length, 49, '49 magician\'s cards rendered');
    assert.equal(find('.picked .card').length, 3, '3 picked cards rendered');
    assert.equal('2♥6♥3♠', _mapCardValues(find('.picked .card')), 'Correct cards picked');
    clickOn('Sort selected cards');
  });

  andThen(() => {
    assert.equal('2♥3♠6♥', _mapCardValues(find('.picked .card')), 'Picked cards are sorted');
    click('.picked .card:eq(0)'); // Return '2♥'
    click('.picked .card:eq(0)'); // Return '3♠'
    click('.picked .card:eq(0)'); // Return '6♥'
  });

  andThen(() => {
    assert.equal(find('.magician-cards .card').length, 52, 'All magicians cards returned');
    assert.notOk(find('.picked .card').length, 'No picked cards rendered');
    clickOn('Show all cards');
  });

  andThen(() => {
    assert.notOk(find('.magician-cards .card:eq(0)').hasClass('absolute'), 'Cards are not positioned absolute');
    assert.equal(find('.magician-cards .card:eq(1)').attr('style'), undefined, 'Cards don\' have inline positioning');
    clickOn('Align cards');
  });

  andThen(() => {
    assert.ok(find('.magician-cards .card:eq(0)').hasClass('absolute'), 'Cards are positioned absolute again');
    assert.equal(find('.magician-cards .card:eq(1)').attr('style'), 'left: 40px;', 'Cards are inline positioned again');
    clickOn('Sort and group cards');
  });

  andThen(() => {
    assert.notOk(find('.pick-card-info').length, 'Pick a card info rendered');
    assert.equal(orderedCardsContend[0], _mapCardValues(find('.magician-cards .cards-wrapper:eq(0) .card')), 'Cards are correctly ordered by ♥');
    assert.equal(orderedCardsContend[1], _mapCardValues(find('.magician-cards .cards-wrapper:eq(1) .card')), 'Cards are correctly ordered by ♠');
    assert.equal(orderedCardsContend[2], _mapCardValues(find('.magician-cards .cards-wrapper:eq(2) .card')), 'Cards are correctly ordered by ♦');
    assert.equal(orderedCardsContend[3], _mapCardValues(find('.magician-cards .cards-wrapper:eq(3) .card')), 'Cards are correctly ordered by ♣');
    clickOn('Sort and align cards');
  });

  andThen(() => {
    assert.ok(find('.pick-card-info').length, 'Pick a card info rendered');
    assert.equal(orderedCardsContend.join(''), _mapCardValues(find('.magician-cards .card')), 'Cards are correctly ordered again');
    assert.ok(find('.magician-cards .card:eq(0)').hasClass('absolute'), 'Cards are positioned absolute again');
    assert.equal(find('.magician-cards .card:eq(1)').attr('style'), 'left: 40px;', 'Cards are inline positioned again');
    clickOn('Shuffle cards');
  });

  andThen(() => {
    assert.notEqual(orderedCardsContend.join(''), _mapCardValues(find('.magician-cards .card')), 'Cards are shuffled');
    clickOn('Hide cards');
  });

  andThen(() => {
    assert.equal(find('.hidden-card-bg').length, 52 ,'All cards display hidden');
    clickOn('Show cards');
  });

  andThen(() => assert.notOk(find('.hidden-card-bg').length ,'All cards shown again'));
});

let clickOn = (text) => {
  click(`button:contains("${text}")`);
};

let _mapCardValues = (cards) => {
  let cardValues = [];
  cards.map((_, card) => {
    let value = card.getElementsByClassName('value')[0].innerText;
    let suit = card.getElementsByClassName('symbol')[0].innerText;
    cardValues.push(`${value}${suit}`);
  });
  return cardValues.join('');
};
