const { expect } = require('chai');
const {
  formatDate,
  renameKey,
  createRef,
  formatData,
} = require('./index');

describe('formatDate()', () => {
  it('formats timestamp as a date object for array with single entry', () => {
    const input = formatDate([{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    }]);
    expect(input[0].created_at).to.be.a('date');
  });
  it('formats timestamp as a date object for array with multiple entries', () => {
    const input = formatDate([{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    }, {
      title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
      created_at: 1500584273256,
    }]);
    expect(input[0].created_at).to.be.a('date');
    expect(input[1].created_at).to.be.a('date');
  });
});

describe('renameKey()', () => {
  it('renames key for array with single object', () => {
    const input = renameKey([{
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      belongs_to: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      created_by: 'weegembump',
      votes: 3,
      created_at: 1504946266488,
    }], 'created_by', 'author');
    const expected = [{
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      belongs_to: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      author: 'weegembump',
      votes: 3,
      created_at: 1504946266488,
    }];
    expect(input).to.eql(expected);
  });
  it('renames key for an array with multiple objects', () => {
    const input = renameKey([{
      body:
        'Reiciendis enim soluta a sed cumque dolor quia quod sint. Laborum tempore est et quisquam dolore. Qui voluptas consequatur cumque neque et laborum unde sed. Impedit et consequatur tempore dignissimos earum distinctio cupiditate.',
      belongs_to: 'Who are the most followed clubs and players on Instagram?',
      created_by: 'happyamy2016',
      votes: 17,
      created_at: 1489789669732,
    },
    {
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      belongs_to: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      created_by: 'weegembump',
      votes: 3,
      created_at: 1504946266488,
    }], 'created_by', 'author');
    expect(input[0]).to.have.keys('body', 'belongs_to', 'author', 'votes', 'created_at');
    expect(input[1]).to.have.keys('body', 'belongs_to', 'author', 'votes', 'created_at');
  });
});

describe('createRef()', () => {
  it('creates a reference object for one entry', () => {
    const input = createRef([{
      article_id: 36,
      title: 'The vegan carnivore?',
    }], 'title', 'article_id');
    const expected = { 'The vegan carnivore?': 36 };
    expect(input).to.eql(expected);
  });
  it('creates a reference object for multiple entries', () => {
    const input = createRef([{
      article_id: 36,
      title: 'The vegan carnivore?',
    },
    {
      article_id: 35,
      title: 'Stone Soup',
    }], 'title', 'article_id');
    const expected = { 'The vegan carnivore?': 36, 'Stone Soup': 35 };
    expect(input).to.eql(expected);
  });
});

describe('formatData()', () => {
  it('swaps key with its reference for array with single object', () => {
    const input = formatData([{
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      belongs_to: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      votes: 3,
      created_at: 1504946266488,
      author: 'weegembump',
    }], 'belongs_to', 'article_id', { 'A BRIEF HISTORY OF FOOD—NO BIG DEAL': 29 });
    const expected = [{
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      article_id: 29,
      votes: 3,
      created_at: 1504946266488,
      author: 'weegembump',
    }];
    expect(input).to.eql(expected);
  });
  it('swaps keys with their references for array with multiple objects', () => {
    const input = formatData([{
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      belongs_to: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      votes: 3,
      created_at: 1504946266488,
      author: 'weegembump',
    },
    {
      body:
        'Enim sunt nam rerum quidem. Quod quia aliquam numquam et laboriosam doloribus iusto et. Numquam quae quis hic maiores. Sed quos et dolore esse cumque consequatur blanditiis placeat omnis. Omnis qui magni explicabo.',
      belongs_to: 'Stone Soup',
      votes: 19,
      created_at: 1515386864038,
      author: 'weegembump',
    }], 'belongs_to', 'article_id', { 'A BRIEF HISTORY OF FOOD—NO BIG DEAL': 29, 'Stone Soup': 35 });
    const expected = [{
      body:
        'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
      article_id: 29,
      votes: 3,
      created_at: 1504946266488,
      author: 'weegembump',
    },
    {
      body:
        'Enim sunt nam rerum quidem. Quod quia aliquam numquam et laboriosam doloribus iusto et. Numquam quae quis hic maiores. Sed quos et dolore esse cumque consequatur blanditiis placeat omnis. Omnis qui magni explicabo.',
      article_id: 35,
      votes: 19,
      created_at: 1515386864038,
      author: 'weegembump',
    }];
  });
});
