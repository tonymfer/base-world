import ky from 'ky';

export class ApiError {
  status: number;
  message: string;

  constructor({ status, message }: { status: number; message: string }) {
    this.status = status;
    this.message = message;
  }
}

export const api = ky.create({
  headers: {
    'content-type': 'application/json',
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (`${response.status}`.startsWith('2')) {
          const json = await response.json();
          return new Response(JSON.stringify(json), {
            status: response.status,
          });
        } else if (`${response.status}`.startsWith('4')) {
          const json = await response.json();
          throw new ApiError({
            status: response.status,
            message: json.message,
          });
        } else {
          return response;
        }
      },
    ],
  },
  prefixUrl: 'https://warpcast.sh/baseglobe/api',
});
