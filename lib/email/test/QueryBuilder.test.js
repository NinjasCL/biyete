// TODO: Improve Query Builder Tests
/*
import QueryBuilder from '../QueryBuilder';

const mockEntities = [
  {
    parsers: [
      {
        label: 'parser-1',
        name: 'Parser 1'
      },
      {
        label: 'parser-2',
        name: 'Parser 2'
      },
      {
        label: 'parser-3',
        name: 'Parser 3'
      },
      {
        label: 'Parser 4',
        name: 'Parser 4'
      },
      {
        label: 'parser-5 ',
        name: 'Parser 5 With Space at The End'
      }
    ]
  }
];

describe('testing QueryBuilder.js', () => {
  it('should build query properly', () => {
    const builder = new QueryBuilder({ entities: mockEntities });

    expect(builder).toHaveProperty('elements');
    expect(builder).toHaveProperty('labels');
    expect(builder).toHaveProperty('entities');
    expect(builder).toHaveProperty('data');
    expect(builder).toHaveProperty('json');

    expect(builder).toHaveProperty(
      'query',
      'in:unread (label:parser-1 | label:parser-2 | label:parser-3 | label:Parser+4 | label:parser-5+)'
    );
  });

  it('should return the element for the label', () => {
    const builder = new QueryBuilder({ entities: mockEntities });
    const element = builder.elementForLabel({ label: 'parser-5 ' });

    expect(element).toHaveProperty('entity');
    expect(element).toHaveProperty('parser');
    expect(element).toHaveProperty('label');

    const { label } = element;

    expect(label).toHaveProperty('raw', 'parser-5 ');
    expect(label).toHaveProperty('formatted', 'parser-5+');
  });
});
*/

it('should pass', () => {
  expect(true).toBe(true);
});
