
exports.up = function (knex, Promise) {
  let date = (new Date(Date.now())).toDateString();
  console.log(date);
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id');
    articlesTable.string('title').notNullable();
    articlesTable.string('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic');
    articlesTable.foreign('topic').references('slug').on('topics');
    articlesTable.string('author');
    articlesTable.foreign('author').references('username').on('users');
    articlesTable.date('created_at').defaultsTo(date);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
