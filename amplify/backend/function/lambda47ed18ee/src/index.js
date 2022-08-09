const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "eu-north-1" });
const table = "Todo-j2kocjz7czfllg5gtpndszt4cy-dev";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case "GET": {
      const data = await docClient
        .scan({
          TableName: table,
        })
        .promise();
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(data),
      };
    }

    case "PUT": {
      const { name, description, id, createdAt, updatedAt, __typename } =
        JSON.parse(event.body);
      await docClient
        .put({
          TableName: table,
          Item: {
            name: name,
            description: description,
            id: id,
            createdAt: createdAt,
            updatedAt: updatedAt,
            __typename: __typename,
          },
        })
        .promise();
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: `post ${id} created` }),
      };
    }

    case "DELETE": {
      const { id } = JSON.parse(event.body);
      await docClient
        .delete({
          TableName: table,
          Key: {
            id: id,
          },
        })
        .promise();
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: `post ${id} deleted` }),
      };
    }
  }
};
