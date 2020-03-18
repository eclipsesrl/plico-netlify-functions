export const UnauthorizedException = (message: string) => {
  return {
    statusCode: 403,
    body: JSON.stringify({
      error: {
        message
      }
    })
  };
};

export const BadRequestException = (message: string) => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      error: {
        message
      }
    })
  };
};

export const InternalServerErrorException = (
  message = 'INTERNAL_SERVER_ERROR'
) => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: {
        message
      }
    })
  };
};
