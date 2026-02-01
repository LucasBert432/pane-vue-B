<script setup lang="ts">
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { useLoginForm } from "../../composables/useRegisterForm";
import { cpfMask } from "../../utils/mask";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { isLoading, submitLogin } = useLoginForm();
const showPassword = ref(false);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  await submitLogin();
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <div :class="$style.headerContent">
        <img
          src="../../assets/image/btg-pactual.png"
          alt="BTG Pactual"
          :class="$style.logo"
        />
      </div>
    </header>

    <div :class="$style.layout">
      <aside :class="$style.left">
        <div :class="$style.leftContent">
          <div :class="$style.imageContainer">
            <img
              src="../../assets/image/artist-btg.png"
              alt="BTG Pactual"
              :class="$style.centerImage"
            />
          </div>
          <div :class="$style.textContainer">
            <h2 :class="$style.slogan">
              Quem espera mais de um banco<br />
              <span :class="$style.sloganHighlight">merece o BTG</span>
            </h2>
          </div>
        </div>
      </aside>

      <main :class="$style.right">
        <div :class="$style.content">
          <div :class="$style.formContainer">
            <h1 :class="$style.title">Acesse sua conta</h1>
            <p :class="$style.subtitle">Digite seu CPF e senha para entrar</p>

            <form @submit="handleSubmit" :class="$style.form">
              <div :class="$style.formContent">
                <div :class="$style.inputGroup">
                  <FormInput
                    name="cpf"
                    label="CPF"
                    placeholder="000.000.000-00"
                    :mask="cpfMask"
                    :disabled="isLoading"
                  />
                </div>

                <div :class="$style.inputGroup">
                  <FormInput
                    name="password"
                    label="Senha"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Digite sua senha"
                    :showPasswordToggle="true"
                    :disabled="isLoading"
                  />
                </div>

                <div :class="$style.forgotPassword">
                  <a href="#" :class="$style.forgotLink">
                    Esqueci minha senha
                  </a>
                </div>

                <div :class="$style.buttonGroup">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    :fullWidth="true"
                    :loading="isLoading"
                    icon="arrow-right"
                    iconPosition="right"
                  >
                    Entrar
                  </Button>
                </div>

                <div :class="$style.divider">
                  <span :class="$style.dividerText">ou</span>
                </div>

                <div :class="$style.buttonGroup">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    :fullWidth="true"
                    :disabled="isLoading"
                    @click="goToRegister"
                    icon="user"
                    iconPosition="left"
                  >
                    Criar conta
                  </Button>
                </div>

                <p :class="$style.terms">
                  Ao acessar, você concorda com os
                  <a
                    href="https://www.btgpactual.com/termos-e-politicas"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$style.termsLink"
                  >
                    Termos de Uso
                  </a>
                  e a
                  <a
                    href="https://www.btgpactual.com/termos-e-politicas"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$style.termsLink"
                  >
                    Política de Privacidade
                  </a>
                  do BTG Pactual.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style module lang="scss">
.page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  height: 72px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

.headerContent {
  width: 100%;
  max-width: 1280px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.logo {
  height: 200;
  width: 120px;
  display: block;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 40%) 1fr;
  flex: 1;
  min-height: calc(100vh - 72px);
  overflow: hidden;
}

.left {
  background: #111827;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(
        circle at 20% 50%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 55%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(255, 255, 255, 0.03) 0%,
        transparent 55%
      ),
      radial-gradient(
        circle at 40% 20%,
        rgba(255, 255, 255, 0.04) 0%,
        transparent 55%
      );
    background-size:
      300px 300px,
      200px 200px,
      250px 250px;
    animation: granularMove 15s ease-in-out infinite alternate;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
}

@keyframes granularMove {
  0% {
    background-position:
      0% 0%,
      0% 0%,
      0% 0%;
  }
  100% {
    background-position:
      100px 50px,
      -50px 100px,
      150px -30px;
  }
}

.leftContent {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.imageContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.centerImage {
  width: 100%;
  max-width: 350px;
  height: auto;
  filter: brightness(1.1);
}

.textContainer {
  width: 100%;
  text-align: center;
}

.slogan {
  font-size: 28px;
  font-weight: 500;
  color: white;
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: 1200px) {
    font-size: 24px;
  }
}

.sloganHighlight {
  font-weight: 700;
  color: #ffffff;
  display: inline-block;
  margin-top: 8px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 1px;
  }
}

.right {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  max-height: calc(100vh - 72px);
  padding: 40px 0;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 440px;
  padding: 0 24px;
}

.formContainer {
  width: 100%;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.5;
}

.form {
  width: 100%;
}

.formContent {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.inputGroup {
  width: 100%;
}

.forgotPassword {
  text-align: right;
  margin-top: -12px;
}

.forgotLink {
  font-size: 14px;
  color: #111827;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #374151;
    text-decoration: underline;
  }
}

.buttonGroup {
  width: 100%;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 8px 0;

  &:before,
  &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }
}

.dividerText {
  padding: 0 16px;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.terms {
  font-size: 13px;
  line-height: 1.5;
  color: #6b7280;
  text-align: center;
  margin-top: 24px;
}

.termsLink {
  color: #111827;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .left {
    display: none;
  }

  .right {
    padding: 60px 0;
  }

  .content {
    max-width: 400px;
  }
}

@media (min-width: 1025px) {
  .left {
    display: flex !important;
  }
}

@media (max-width: 768px) {
  .header {
    height: 64px;
  }

  .logo {
    width: 100px;
    height: auto;
  }

  .right {
    padding: 40px 0;
    max-height: calc(100vh - 64px);
  }

  .content {
    padding: 0 20px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 15px;
    margin-bottom: 32px;
  }

  .formContent {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .header {
    height: 56px;
  }

  .headerContent {
    padding: 0 16px;
  }

  .right {
    padding: 32px 0;
    max-height: calc(100vh - 56px);
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 28px;
  }

  .terms {
    font-size: 12px;
  }

  .slogan {
    font-size: 20px;
  }
}
</style>
