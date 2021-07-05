const requestIsIncompelete = (req, includeValues) => {
  const errors = [];
  req.body.forEach((element) => {
    if (!includeValues.includes(element)) errors.push(element);
  });
  if (errors.length === 0) return false;
  else return errors;
};

module.exports = requestIsIncompelete;
