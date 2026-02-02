<script setup lang="ts">
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import FormInput from "../../components/FormInput";
import { formatCPF, formatPhone } from "../../utils/formatters";
import { cpfMask, phoneMask } from "../../utils/mask";
import { useRegisterForm } from "../../composables/useRegisterForm";
import BaseCheckbox from "../../components/BaseCheckbox";

const { isLoading, isSuccess, userData, values, submitForm, goToHome } =
  useRegisterForm();

const countries = [
  { label: "Brasil", value: "BR" },
  { label: "Estados Unidos", value: "US" },
  { label: "Portugal", value: "PT" },
  { label: "Argentina", value: "AR" },
  { label: "Chile", value: "CL" },
  { label: "Uruguai", value: "UY" },
  { label: "Espanha", value: "ES" },
  { label: "França", value: "FR" },
  { label: "Alemanha", value: "DE" },
  { label: "Outro", value: "OTHER" },
];

const handleFormSubmit = async (e: Event) => {
  e.preventDefault();
  await submitForm();
};

const getCountryName = (code: string) => {
  const country = countries.find((c) => c.value === code);
  return country ? country.label : code;
};

defineExpose({
  formatCPF,
  formatPhone,
  phoneMask,
  cpfMask,
  getCountryName,
});
</script>

<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <div :class="$style.headerContent">
        <img src="../../assets/image/btg-pactual.png" alt="BTG Pactual" />
      </div>
    </header>

    <div :class="$style.layout">
      <aside :class="$style.left">
        <img src="../../assets/image/womanBtg.png" />
      </aside>

      <main :class="$style.right">
        <div :class="$style.content">
          <div :class="$style.stepper">
            <div :class="$style.progressLine"></div>
            <div :class="[$style.step, $style.active]">
              <span class="label">Preencha<br />seus dados</span>
              <span class="dot"></span>
            </div>
            <div :class="[$style.step, $style.completed]">
              <span class="label">Finalize</span>
              <span class="dot"></span>
            </div>
          </div>

          <div v-if="!isLoading && !isSuccess">
            <h1>Abra sua conta</h1>
            <p>Comece aqui, leva poucos minutos</p>
          </div>

          <div v-if="isLoading" :class="$style.loadingContainer">
            <div :class="$style.loadingContent">
              <div :class="$style.spinner"></div>
              <h2 :class="$style.loadingTitle">Processando seu cadastro</h2>
              <p :class="$style.loadingText">
                Aguarde enquanto estamos validando as informações enviadas. Isso
                pode levar alguns segundos.
              </p>
            </div>
          </div>

          <div
            v-else-if="isSuccess && userData"
            :class="$style.successContainer"
          >
            <div :class="$style.successContent">
              <div :class="$style.successIcon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                    stroke="#10B981"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 4L12 14.01L9 11.01"
                    stroke="#10B981"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <h2 :class="$style.successTitle">
                Cadastro realizado com sucesso!
              </h2>
              <p :class="$style.successSubtitle">
                Sua conta no BTG Pactual foi criada. Abaixo estão os detalhes da
                sua conta:
              </p>

              <div :class="$style.userInfo">
                <div :class="$style.infoRow">
                  <span :class="$style.infoLabel">Nome:</span>
                  <span :class="$style.infoValue">{{ userData.name }}</span>
                </div>
                <div :class="$style.infoRow">
                  <span :class="$style.infoLabel">E-mail:</span>
                  <span :class="$style.infoValue">{{ userData.email }}</span>
                </div>
                <div :class="$style.infoRow">
                  <span :class="$style.infoLabel">CPF:</span>
                  <span :class="$style.infoValue">{{
                    formatCPF(userData.cpf.replace(/\D/g, ""))
                  }}</span>
                </div>
                <div :class="$style.infoRow">
                  <span :class="$style.infoLabel">Telefone:</span>
                  <span :class="$style.infoValue">{{
                    formatPhone(userData.phone.replace(/\D/g, ""))
                  }}</span>
                </div>
                <div :class="$style.infoRow">
                  <span :class="$style.infoLabel">País:</span>
                  <span :class="$style.infoValue">{{
                    getCountryName(userData.country)
                  }}</span>
                </div>
                <div :class="$style.infoRow">
                  <span :class="$style.infoLabel">Número da conta:</span>
                  <span :class="$style.infoValue">{{
                    userData.accountNumber
                  }}</span>
                </div>
                <div
                  v-if="userData.hasAdvisor && userData.advisorName"
                  :class="$style.infoRow"
                >
                  <span :class="$style.infoLabel">Assessor:</span>
                  <span :class="$style.infoValue">{{
                    userData.advisorName
                  }}</span>
                </div>
              </div>

              <div :class="$style.successNote">
                <p>
                  Em breve você receberá um e-mail com as instruções para
                  acessar sua conta e começar a investir.
                </p>
              </div>

              <Button
                @click="goToHome"
                type="button"
                variant="primary"
                size="lg"
                :fullWidth="true"
                icon="home"
                iconPosition="left"
              >
                Acessar Minha Conta
              </Button>
            </div>
          </div>

          <form v-else @submit="handleFormSubmit" :class="$style.form">
            <div :class="$style.formContent">
              <div :class="$style.grid">
                <div :class="$style.containerInput">
                  <FormInput
                    name="name"
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div :class="$style.containerInput">
                  <FormInput
                    name="email"
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                  />
                </div>
                <div :class="$style.containerInput">
                  <FormInput
                    name="cpf"
                    label="CPF"
                    placeholder="000.000.000-00"
                    :mask="cpfMask"
                  />
                </div>
                <div :class="$style.containerInput">
                  <FormInput
                    name="phone"
                    label="Celular"
                    placeholder="(00) 00000-0000"
                    :mask="phoneMask"
                  />
                </div>
                <div :class="$style.leftOnly">
                  <Dropdown
                    name="country"
                    label="País de residência"
                    :options="countries"
                    placeholder="Selecione um país"
                    searchable
                  />
                </div>
              </div>

              <div :class="$style.leftOnly">
                <FormInput
                  name="password"
                  label="Senha"
                  :showPasswordToggle="true"
                  type="password"
                  placeholder="Digite sua senha"
                  hint="Use 6 a 8 dígitos, sem números repetidos ou em sequência."
                />
              </div>

              <div :class="$style.leftOnly">
                <BaseCheckbox
                  name="hasAdvisor"
                  label="Possuo relacionamento com assessor"
                />
              </div>

              <div v-if="values.hasAdvisor" :class="$style.advisorField">
                <FormInput
                  name="advisorName"
                  label="Nome do assessor"
                  placeholder="Digite o nome do assessor"
                />
              </div>

              <p :class="$style.terms">
                Ao continuar, você autoriza a consulta e o registro dos seus
                dados no
                <strong>Sistema de Informações de Crédito (SCR)</strong> do
                Banco Central e também está de acordo com a
                <a
                  href="https://www.btgpactual.com/termos-e-politicas"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Política de Privacidade</a
                >
                e os
                <a
                  href="https://www.btgpactual.com/termos-e-politicas"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Termos de Uso</a
                >
                do BTG Pactual.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                :loading="isLoading"
                :fullWidth="true"
                icon="arrow-right"
                iconPosition="right"
              >
                Finalizar cadastro
              </Button>
            </div>
          </form>
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

.headerContent img {
  height: 200;
  width: 120px;
  display: block;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 35%) 1fr;
  flex: 1;
  min-height: calc(100vh - 72px);
  overflow: hidden;
}

.left {
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right center;
  }
}

.right {
  display: flex;
  justify-content: center;
  overflow-y: auto;
  max-height: calc(100vh - 72px);
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90%;
  padding: 56px 24px 40px;
}

.form {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.formContent {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 20px;
}

.leftOnly {
  grid-column: 1 / 2;
}

.advisorField {
  margin-top: 16px;
  max-width: 360px;
}

.terms {
  font-size: 13px;
  line-height: 1.4;
  color: #6b7280;
  margin-top: 8px;

  a {
    color: #111827;
    font-weight: 500;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  strong {
    font-weight: 500;
    color: #111827;
  }
}

.stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 40px;
}

.progressLine {
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #111827;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #111827;
  }
}

.step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  text-align: center;
  font-size: 14px;
  color: #9ca3af;

  .label {
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #111827;
  }
}

.active {
  color: #111827;
  font-weight: 500;
}

.completed {
  color: #9ca3af;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

p {
  margin-bottom: 32px;
  color: #6b7280;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.containerInput {
  gap: 12px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #111827;
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}

.submit {
  margin-top: 32px;
  height: 48px;
  background: #111827;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: background 0.2s;

  &:hover {
    background: #374151;
  }
}

.loadingContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loadingContent {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.spinner {
  width: 64px;
  height: 64px;
  border: 4px solid #f3f4f6;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loadingTitle {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.loadingText {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.successContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.successContent {
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 120px;
}

.successIcon {
  color: #10b981;
  margin-bottom: 8px;
}

.successTitle {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin: 0;
}

.successSubtitle {
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
  margin: 0 0 16px;
}

.userInfo {
  width: 100%;
  background: #f9fafb;
  border-radius: 8px;
  padding: 24px;
  margin: 16px 0;
}

.infoRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
}

.infoLabel {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.infoValue {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
  text-align: right;
}

.successNote {
  background: #f0f9ff;
  border: 1px solid #dbeafe;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;

  p {
    font-size: 14px;
    color: #1e40af;
    line-height: 1.5;
    margin: 0;
  }
}

.successButton {
  width: 100%;
  height: 48px;
  background: #111827;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
  margin-top: 16px;

  &:hover {
    background: #374151;
  }
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .left {
    display: none;
  }

  .right {
    max-height: calc(100vh - 72px);
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .leftOnly {
    grid-column: auto;
  }

  .content {
    max-width: 100%;
    padding: 40px 24px 40px;
  }

  .successContainer,
  .loadingContainer {
    padding: 40px 0;
  }
}

@media (max-width: 768px) {
  .stepper {
    margin-bottom: 32px;
  }

  h1 {
    font-size: 28px;
  }

  .content {
    padding: 32px 20px 40px;
  }

  .successTitle {
    font-size: 24px;
  }

  .userInfo {
    padding: 16px;
  }

  .infoRow {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .infoValue {
    text-align: left;
  }
}
</style>
