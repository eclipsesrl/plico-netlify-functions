export type FunctionEventResponse = {
  statusCode: number;
  headers?: { [key: string]: any };
  body: string;
};

export const OkResponse = (body: string | object, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(body)
  };
};
