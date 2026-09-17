export function normalizeSettings(speed, stars) {
  return {
    speed: Math.max(0, Math.min(10, Math.round(Number(speed) || 0))),
    stars: Math.max(0, Math.min(10, Math.round(Number(stars) || 0)))
  };
}

export function moveDelay(speed) {
  return 2200 - normalizeSettings(speed, 1).speed * 180;
}

export function scoreMultiplier(speed, stars) {
  const settings = normalizeSettings(speed, stars);
  return Number((1 + settings.speed * 0.12 + Math.max(0, settings.stars - 1) * 0.09).toFixed(2));
}

export function awardedPoints(catches, speed, stars) {
  return Math.max(0, Math.round(Number(catches) * scoreMultiplier(speed, stars)));
}

export function validUsername(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_]{3,18}$/.test(value);
}
