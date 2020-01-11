export const trimAllText = str => {
  // trim leading and trailing whitespace
  let save = str.trim();
  // trim inbetween new lines
  save = save.replace(/(\r\n|\n|\r|\t)/gm, " ");
  // trim inbetween spaces
  save = save.replace(/ +/g, " ");
  return save;
};

export const trimAllPrice = str => {
  // trim leading and trailing whitespace
  let save = str.trim();
  // trim inbetween new lines
  save = save.replace(/(\r\n|\n|\r|\t)/gm, " ");
  // trim inbetween spaces
  save = save.replace(/ +/g, "");
  return save;
};
