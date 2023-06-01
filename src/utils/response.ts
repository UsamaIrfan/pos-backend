export const SuccessResponse = (data: any, message?: string) => ({
  success: true,
  message: message ?? "success",
  data,
});

// const ErrorResponse = (error, message) => ({
//   success: false,
//   message: message ?? 'Something went wrong',
//   error,
// });

export class HttpException extends Error {
  status: number;
  errors: any;
  constructor(message: string, status: number, errors?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
