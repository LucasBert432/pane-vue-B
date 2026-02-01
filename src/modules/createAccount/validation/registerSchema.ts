import * as yup from "yup";
import type { RegisterForm } from "../types/user";

const countries = [
  "BR",
  "US",
  "PT",
  "AR",
  "CL",
  "UY",
  "ES",
  "FR",
  "DE",
  "OTHER",
] as const;

export const registerSchema: yup.Schema<RegisterForm> = yup.object({
  name: yup.string().required("Campo obrigatório"),

  email: yup.string().email("Email inválido").required("Campo obrigatório"),

  cpf: yup.string().length(14, "CPF inválido").required("Campo obrigatório"),

  phone: yup.string().min(14, "Celular inválido").required("Campo obrigatório"),

  country: yup
    .string()
    .oneOf(countries, "País inválido")
    .required("Selecione um país"),

  password: yup
    .string()
    .min(6, "Mínimo 6 dígitos")
    .max(8, "Máximo 8 dígitos")
    .required("Campo obrigatório"),

  hasAdvisor: yup.boolean(),

  advisorName: yup.string().when("hasAdvisor", {
    is: true,
    then: (schema) => schema.required("Informe o nome do assessor"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
