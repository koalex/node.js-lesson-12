
const assert    = require('assert');
const supertest = require('supertest');
const server    = require('../server');
const request   = supertest(server);

describe('SERVER', () => {

	before(done => {
		server.listen(process.env.PORT, done);
	});

	after(done => {
		server.close(done);
	});

	describe('SMOKE test', () => {

		it('СЕРВЕР ДОЛЖЕН ВЕРНУТЬ АДРЕС...', done => {
			const address = server.address();

			if (!['address', 'family', 'port'].every(k => k in address)) {
				return done(new Error('server does not start'));
			}

			done();
		});

		it('СЕРВЕР ДОЛЖЕН ОТДАТЬ СТАТИКУ...', done => {
			request
				.get('/signin')
				.expect(200)
				.expect(response => {
					assert.strictEqual(true, response.text.toLowerCase().includes('авторизация'));
				})
				.end(done);
		});

	});

});

