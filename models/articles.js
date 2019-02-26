const connection = require('../db/connection');

exports.getArticles = () => connection('comments').select('*');
