const auth = async (req, res, next) => {
  const randomInteger = Math.floor(Math.random() * 100);
  req.random = randomInteger;
  next();
};

export default auth;
