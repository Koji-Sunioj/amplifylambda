const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "eu-north-1" });

const params = { TableName: "Todo-j2kocjz7czfllg5gtpndszt4cy-dev" };
const table = "Todo-j2kocjz7czfllg5gtpndszt4cy-dev";

//Key: {
//    id: "7db806b8-de93-46a8-badb-896c57211767",
//  },

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case "GET":
      const data = await docClient.scan(params).promise();
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

    case "PUT": {
      const { name, description } = JSON.parse(event.body);
      await docClient
        .put({
          TableName: table,
          Item: { name: name, description: description, id: "10" },
        })
        .promise();
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
      };
    }
  }
};
