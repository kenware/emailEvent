# Email Event
This app receives an event from mailgun, saves it on AWS DynamoDB and publishes it to AWS SNS topic.

## Tools and technology
- Serverless
- Lambda
- Express/typescript
- DynamoDB
- SNS
- CI/CD - github action
- Mocha and chai - integration testing

## Local Deployment steps.
- Clone this repo
- In the root project run `npm install`
- Ensure serverless is installed - `npm i serverless -g`
- In the project root, create a `.env` file and add the following environmental variables.
```
SNS_TOPIC_NAME=<sns-topic-name>
EMAIL_SUBSCRIBER=<email-address-to-subscriber>
EMAIL_EVENT_TABLE_NAME=<dynamoDb-email-event-table-name>
REGION=<aws-region>
MAILGUN_WEBHOOK_SIGNIN_KEY=<mailgun-signin-key>
```
- Ensure you have AWS cli setup and configured. This project/Serverless will use the `default profile` to deploy to an AWS account.
- Run `sls deploy` to deploy this application to AWS.


## CI/CD deployment using github action
- Create a github repository
- Move/copy this application to the `main` branch of the repository. The application must be on the branch "`main`" before the CI/CD pipeline will start.
- On the repository on [Github](https://github.com/) , add the following [Github](https://github.com/) `secrete` for the github action.
```
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
SNS_TOPIC_NAME=<new-sns-topic-name-to-create-by-serverless>
EMAIL_SUBSCRIBER=<email-address-to-subscriber>
EMAIL_EVENT_TABLE_NAME=<dynamoDb-email-event-table-name>
REGION=<aws-region>
MAILGUN_WEBHOOK_SIGNIN_KEY=<mailgun-signin-key>
```
- Git push to the `main` branch. This will start github action deployment pipeline.


### NB: The above deployment, either `local or via CI/CD` pipeline will do the following
- Create a lambda function on the AWS.
- Create an API gateway endpoint.
- Create a dynamoDB table on the AWS: The table name will correspond to the `EMAIL_EVENT_TABLE_NAME` environmental variable value.
- Creates an `SNS` topic: The topic name will correspond to the `SNS_TOPIC_NAME` environmental variable value.
- Creates an `email` subscription protocol. The subscribed email address correspond to the `EMAIL_SUBSCRIBER` environmental variable value. `After the deployment, AWS will send a confirmation email to this email address which need to be confirmed before it is able to receive event published on the topic.`

## Testing with the mailgun webhook
- After the deployement `either via LOCAL or CI/CD`, serverless will print the API gateway endpoint in the deployment console/output. The general pattern of the endpoint is:
```
https://<APP-ID>.execute-api.<REGION>.amazonaws.com/<STAGE>
```
  The `STAGE` for this configuration will be `dev`.

  NB: THE URL OUTPUT ON THE CONSOLE MAY HAVE THE REGION AS `***` OR APP-ID AS `******`. Ensure you replace this appropriately on the url. eg if you get the url as `https://3fhox3ixvb.execute-api.***.amazonaws.com/dev/`. This should be replaced with a valid region.
  
  [See the endpoint generated with Github action](https://github.com/kenware/emailEvent/runs/4973612297?check_suite_focus=true#step:6:55). The `***` in `https://3fhox3ixvb.execute-api.***.amazonaws.com/dev` have to be replaced with a valid REGION.

- Because this is an express app, `/v1/emails/event` will be appended to the url generated by serverless. The full URL that can receive an event will look like. 
```
https://<APP-ID>.execute-api.<REGION>.amazonaws.com/dev/v1/emails/event
```

NB: THE URL OUTPUT ON THE CONSOLE MAY HAVE THE REGION AS `***` OR APP-ID AS `******`. Ensure you replace this appropriately on the url.
- Copy the `URL` and navigate to [mailgun](https://app.mailgun.com/app/dashboard) webhook console and test using different event types.

NB: It must be from the same account and/or mailgun domain where `MAILGUN_WEBHOOK_SIGNIN_KEY` environmental variable value was used.

## Result
- When you test with mailgun webhook, you should receive a success response.
- A record will be created on dynamoDB.
- An event published on the subscribed email. AWS will send a confirmation email to the subscribed email address before it is able to receive event published on the topic.

NB: You can also manually subscribe other protocol on the AWS console on that topic.

## Integration test with mocha and chai
- On the root of the project, run test with `npm test`.
