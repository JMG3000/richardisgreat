const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/score');

function invoke({ method = 'POST', contentType = 'application/json', body = {} } = {}) {
  const result = { headers: {} };
  const request = { method, headers: { 'content-type': contentType }, body };
  const response = {
    setHeader(key, value) { result.headers[key] = value; },
    status(code) { result.status = code; return this; },
    json(payload) { result.body = payload; return this; }
  };
  handler(request, response);
  return result;
}

test('accepts a valid score POST', () => {
  assert.deepEqual(invoke({ body: { score: 12 } }), {
    headers: { Allow: 'POST', 'Cache-Control': 'no-store' }, status: 200, body: { ok: true, score: 12 }
  });
});

test('rejects invalid scores, media types, and methods', () => {
  assert.equal(invoke({ body: { score: -1 } }).status, 400);
  assert.equal(invoke({ body: { score: '12' } }).status, 400);
  assert.equal(invoke({ contentType: 'text/plain', body: { score: 1 } }).status, 415);
  assert.equal(invoke({ method: 'GET' }).status, 405);
});
