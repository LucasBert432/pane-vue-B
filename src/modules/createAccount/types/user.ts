export interface RegisterForm {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  country: string;
  password: string;
  hasAdvisor: boolean;
  advisorName?: string;
}
