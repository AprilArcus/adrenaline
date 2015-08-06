jest.autoMockOff();

describe('compileQuery', () => {
  it('should correctly compile query', () => {
    const compileQuery = require('../compileQuery');

    const queries = {
      todos: `
        todos(count: <count>) {
          _id,
          ... on Todo {
            text
          }
        }
      `,
    }
    const params = {
      count: 5,
    };

    const compiled = compileQuery(queries, params);

    expect(compiled.replace(/\s+/g, ' ').trim()).toEqual(`
      todos: todos(count: 5) {
        _id,
        ... on Todo {
          text
        }
      }
    `.replace(/\s+/g, ' ').trim());
  });
});
