
export class ApiResponse {

  message: string;
  data: any;
  errors: any[];
  success: boolean;
  statusCode: number;

  constructor(message?: string, data?: any, errors?: any[], success?: boolean, statusCode?: number) {
    this.message = message || null;
    this.data = data || null;
    this.errors = errors || [];
    this.success = success || true;
    this.statusCode = statusCode || 200;
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setData(data: any) {
    this.data = data;
    return this;
  }

  setErrors(errors: any) {
    this.errors = errors;
    return this;
  }

  setSuccess(success: boolean) {
    this.success = success;
    return this;
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

}
