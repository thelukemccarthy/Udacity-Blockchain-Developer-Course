const isStarValid = (star) => {
  return !!(star.dec && star.ra && star.story && hasNonAscii(star.story));
};

const hasNonAscii = (string) => {
  for (var i = 0; i < string.length; i++) {
    if (string.charCodeAt(i) > 127){
      return false;
    }
  }

  return true;
};

module.exports = {
  isStarValid,
}