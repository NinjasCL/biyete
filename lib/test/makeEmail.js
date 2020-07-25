const makeEmail = ({ id = 'test', name = 'Test', body = '' } = {}) => ({
  id,
  name,
  message: { body }
});

export default makeEmail;
