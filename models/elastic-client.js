var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'http://reservatureserva.ddns.net:9200',
	log: 'trace'
});

module.exports = client;