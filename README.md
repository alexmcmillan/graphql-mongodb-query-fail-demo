Example showing failure retrieving a simple object from MongoDB.

Assumes you have a mongodb instance available at `mongodb://localhost` and have run `npm i`

1. Run `npm start`
2. Browse to `http://localhost:3001/graphql`
3. Create a new Thing:

```
mutation {
  create(name: "Test")
  {
    id,
    name
  }
}
```

4. Simple Query:

```
query {
  thing {
    id
    name
  }
}
```

Upon 3, I see the following output:

```
{
  "errors": [
    {
      "message": "ID cannot represent value: { _bsontype: \"ObjectID\", id: <Buffer 5b 96 3d bf 98 0a 04 09 85 c6 6e a1> }",
      "locations": [
        {
          "line": 32,
          "column": 5
        }
      ],
      "path": [
        "create",
        "id"
      ]
    }
  ],
  "data": {
    "create": {
      "id": null,
      "name": "Test"
    }
  }
}
```

If I then:

- `npm rm graphql`
- `npm i graphql@0.13.2`

and repeat, it works fine.
