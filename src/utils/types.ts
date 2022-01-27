export interface SNSDataValue {
  Provider: string,
  timestamp: number,
  type: string,
}

export interface ParamsValue {
  Message: any,
  TopicArn: string
}

export interface RuleValue{
  token: string,
  signature: string,
  timestamp: string,
  event: string,
  id: string,
};
