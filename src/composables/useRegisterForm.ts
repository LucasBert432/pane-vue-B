import { ref, computed, Ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/composables/useToast";
import type { User } from "@/store/useAuthStore";

interface FormValues {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  country: string;
  password: string;
  hasAdvisor: boolean;
  advisorName: string;
}

export function useRegisterForm() {
  const router = useRouter();
  const authStore = useAuthStore();
  const { success: showSuccess, error: showError } = useToast();

  const isLoading = computed(() => authStore.isLoading);
  const isSuccess: Ref<boolean> = ref(false);
  const userData: Ref<User | null> = ref(null);

  const schema = yup.object({
    name: yup.string().required("Nome completo é obrigatório"),
    email: yup
      .string()
      .email("Digite um e-mail válido")
      .required("E-mail é obrigatório"),
    cpf: yup
      .string()
      .required("CPF é obrigatório")
      .test("cpf", "CPF inválido", (value) => {
        if (!value) return false;
        const cleaned = value.replace(/\D/g, "");
        return cleaned.length === 11;
      }),
    phone: yup
      .string()
      .required("Celular é obrigatório")
      .test("phone", "Celular inválido", (value) => {
        if (!value) return false;
        const cleaned = value.replace(/\D/g, "");
        return cleaned.length === 11;
      }),
    country: yup.string().required("País é obrigatório"),
    password: yup
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .max(8, "Senha deve ter no máximo 8 caracteres")
      .required("Senha é obrigatória"),
    hasAdvisor: yup.boolean(),
    advisorName: yup.string().when("hasAdvisor", {
      is: true,
      then: (schema) => schema.required("Nome do assessor é obrigatório"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const { handleSubmit, values } = useForm<FormValues>({
    validationSchema: schema,
    initialValues: {
      hasAdvisor: false,
      advisorName: "",
    } as FormValues,
  });

  const submitForm = handleSubmit(async (formValues: FormValues) => {
    try {
      console.log("Submitting registration:", formValues);

      const result = await authStore.register({
        ...formValues,
        cpf: formValues.cpf.replace(/\D/g, ""),
        phone: formValues.phone.replace(/\D/g, ""),
      });

      if (result.success && result.data) {
        userData.value = result.data.user;
        isSuccess.value = true;

        showSuccess(
          "Cadastro realizado!",
          "Sua conta foi criada com sucesso. Você será redirecionado em instantes.",
        );

        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        showError(
          "Erro no cadastro",
          result.error || "Não foi possível criar sua conta. Tente novamente.",
        );
      }
    } catch (error: any) {
      showError(
        "Erro no cadastro",
        error.message || "Não foi possível criar sua conta. Tente novamente.",
      );
    }
  });

  const goToHome = () => {
    router.push("/home");
  };

  return {
    isLoading,
    isSuccess,
    userData,
    values,
    submitForm,
    goToHome,
  };
}

export function useLoginForm() {
  const router = useRouter();
  const authStore = useAuthStore();
  const { success: showSuccess, error: showError } = useToast();

  interface LoginFormValues {
    cpf: string;
    password: string;
  }

  const schema = yup.object({
    cpf: yup
      .string()
      .required("CPF é obrigatório")
      .test("cpf", "CPF inválido", (value) => {
        if (!value) return false;
        const cleaned = value.replace(/\D/g, "");
        return cleaned.length === 11;
      }),
    password: yup.string().required("Senha é obrigatória"),
  });

  const { handleSubmit } = useForm<LoginFormValues>({
    validationSchema: schema,
  });

  const submitLogin = handleSubmit(async (formValues: LoginFormValues) => {
    try {
      const result = await authStore.login({
        cpf: formValues.cpf.replace(/\D/g, ""),
        password: formValues.password,
      });

      if (result.success) {
        showSuccess("Login realizado!", "Seja bem-vindo(a) de volta!");

        router.push("/home");
      } else {
        showError(
          "Erro no login",
          result.error || "CPF ou senha incorretos. Tente novamente.",
        );
      }
    } catch (error: any) {
      showError(
        "Erro no login",
        error.message || "CPF ou senha incorretos. Tente novamente.",
      );
    }
  });

  return {
    isLoading: computed(() => authStore.isLoading),
    submitLogin,
  };
}
