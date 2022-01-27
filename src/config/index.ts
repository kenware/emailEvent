import AWS from "aws-sdk";
import dynamo from 'dynamodb';

const { env } = process

AWS.config.update({region: env.REGION});

const dynamoDbClient = new AWS.DynamoDB();
dynamo.dynamoDriver(dynamoDbClient);

export default {
  AWS,
  DB: dynamo
};

