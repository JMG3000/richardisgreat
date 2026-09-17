const test = require("node:test");
const assert = require("node:assert/strict");

async function game() { return import("../lib/game.js"); }

test("settings clamp to the 0–10 range", async () => {
  const { normalizeSettings } = await game();
  assert.deepEqual(normalizeSettings(-5, 14), { speed: 0, stars: 10 });
});

test("higher difficulty increases score multiplier", async () => {
  const { scoreMultiplier, awardedPoints, moveDelay } = await game();
  assert.ok(scoreMultiplier(10, 10) > scoreMultiplier(1, 1));
  assert.ok(moveDelay(10) < moveDelay(0));
  assert.equal(awardedPoints(10, 0, 1), 10);
});

test("usernames use the public safe format", async () => {
  const { validUsername } = await game();
  assert.equal(validUsername("Richard_3000"), true);
  assert.equal(validUsername("ri"), false);
  assert.equal(validUsername("email@example.com"), false);
});
