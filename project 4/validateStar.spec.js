const expect = require('chai').expect;

const validateStar = require('./validateStar');

describe.only('validateStar', () => {
  const getValidStarObject = () => ({
    dec: "-26° 29' 24.9",
    ra: '16h 29m 1.0s',
    story: 'Found star using https://www.google.com/sky/',
  });

  it('given a star object with all required fields when isStarValid is called then true should be returned', () => {
    const star = getValidStarObject();

   const result = validateStar.isStarValid(star);

   expect(result).to.equal(true);

  });

  it('given a star object does not have a dec when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    delete star.dec;

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });

  it('given a star object has an empty dec when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    star.dec = "";

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });

  it('given a star object does not have a ra when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    delete star.ra;

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });

  it('given a star object has an empty ra when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    star.ra = "";

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });

  it('given a star object does not have a story when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    delete star.story;

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });

  it('given a star object has an empty story when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    star.story = "";

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });

  it('given a star object has a story with non ASCII character when isStarValid is called then false should be returned', () => {
    const star = getValidStarObject();
    star.story = "¡";

    const result = validateStar.isStarValid(star);

    expect(result).to.equal(false);
  });
});