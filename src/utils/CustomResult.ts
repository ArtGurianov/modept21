import { v4 } from 'uuid';

export interface CustomResultInterface {
  ok?: boolean;
  value?: string;
  errors?: CustomError[];
}
export class CustomError {
  constructor({
    location,
    errorMessages,
  }: {
    location: string;
    errorMessages: string[];
  }) {
    this.id = v4();
    this.location = location;
    this.errorMessages = errorMessages;
  }
  id: string;
  location: string;
  errorMessages: string[];
}

export class CustomResult implements CustomResultInterface {
  constructor(data: CustomResultInterface) {
    if (data.ok) this.ok = data.ok;
    if (data.value) this.value = data.value;
    if (data.errors) this.errors = data.errors;
    this.id = v4();
  }

  id: string;

  ok: boolean;

  value: string;

  errors?: CustomError[];
}
