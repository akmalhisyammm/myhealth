const { Canister, text, query } = require('azle');

export default Canister({
  sayHello: query([], text, () => 'Hello World'),
});
