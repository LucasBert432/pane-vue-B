<template>
  <div :class="$style.layout">
    <Sidebar :class="[$style.sidebar, { [$style.show]: showMobileSidebar }]" />

    <main :class="$style.content">
      <header :class="$style.header">
        <div :class="$style.headerTop">
          <button
            v-if="isMobile"
            :class="$style.menuButton"
            @click="toggleSidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div :class="$style.userInfo">
            <div :class="$style.greeting">
              <h1>{{ greeting }}, {{ userName }}</h1>
            </div>
            <p :class="$style.subtitle">
              Agência {{ userBranch }} • Conta {{ userAccountNumber }}
            </p>
          </div>

          <div :class="$style.tierBadge">
            <Crown :size="14" />
            <span>{{ userTier }}</span>
          </div>
        </div>
      </header>

      <section :class="$style.cardsSection">
        <h2 :class="$style.sectionTitle">Visão Geral</h2>
        <div :class="$style.cardsGrid">
          <DashboardCard
            label="Saldo em conta"
            :value="formatCurrency(balance.account)"
            icon="wallet"
            :trend="2.5"
            :loading="isLoading"
          />
          <DashboardCard
            label="Investimentos"
            :value="formatCurrency(balance.investments)"
            :subtext="`${formatPercent(balance.investmentsGrowth)} este mês`"
            icon="trending-up"
            :trend="balance.investmentsGrowth"
            :loading="isLoading"
            :highlight="balance.investmentsGrowth > 0"
          />
          <DashboardCard
            label="Cartão de Crédito"
            :value="formatCurrency(balance.creditAvailable)"
            :subtext="`Usado: ${formatCurrency(balance.creditUsed)}`"
            icon="credit-card"
            :usage="balance.creditUsed / balance.creditLimit"
            :loading="isLoading"
          />
          <DashboardCard
            label="Patrimônio Total"
            :value="formatCurrency(balance.totalPatrimony)"
            :subtext="`+${formatPercent(balance.totalGrowth)} este ano`"
            icon="shield"
            :trend="balance.totalGrowth"
            :loading="isLoading"
            :highlight="true"
          />
        </div>
      </section>

      <section :class="$style.chartSection">
        <div :class="$style.chartCard">
          <div :class="$style.chartHeader">
            <div>
              <h3 :class="$style.sectionTitle">Evolução do Patrimônio</h3>
              <p :class="$style.chartSubtitle">Últimos 12 meses</p>
            </div>
            <div :class="$style.chartControls">
              <div :class="$style.timeFilters">
                <button
                  v-for="period in timePeriods"
                  :key="period.value"
                  :class="[
                    $style.timeFilter,
                    { [$style.active]: activePeriod === period.value },
                  ]"
                  @click="changeTimePeriod(period.value)"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>
          </div>
          <div :class="$style.chartContainer">
            <Line
              :data="chartData"
              :options="isMobile ? chartOptionsMobile : chartOptions"
            />
          </div>
          <div :class="$style.chartStats">
            <div :class="$style.statItem">
              <span :class="$style.statLabel">Maior valor</span>
              <strong :class="$style.statValue">
                {{ formatCurrency(chartStats.high) }}
              </strong>
            </div>
            <div :class="$style.statItem">
              <span :class="$style.statLabel">Variação</span>
              <strong
                :class="[
                  $style.statValue,
                  chartStats.change >= 0 ? $style.positive : $style.negative,
                ]"
              >
                {{ formatPercent(chartStats.change) }}
              </strong>
            </div>
            <div :class="$style.statItem">
              <span :class="$style.statLabel">Média mensal</span>
              <strong :class="$style.statValue">
                {{ formatCurrency(chartStats.average) }}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section :class="$style.creditCardSection">
        <div :class="$style.sectionHeader">
          <div>
            <h3 :class="$style.sectionTitle">Cartões de Crédito</h3>
            <p :class="$style.cardSubtitle">
              Limite total: {{ formatCurrency(balance.creditLimit) }}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon="plus"
            :class="$style.addButton"
          >
            <span v-if="!isMobile">Novo cartão</span>
          </Button>
        </div>

        <div :class="$style.creditCards">
          <div
            v-for="card in creditCards"
            :key="card.id"
            :class="$style.creditCard"
            @click="viewCardDetails(card)"
          >
            <div :class="$style.cardContent">
              <div :class="$style.cardHeaderInfo">
                <div :class="$style.cardIcon">
                  <CreditCard :size="24" />
                </div>
                <div :class="$style.cardInfo">
                  <div :class="$style.cardNumber">
                    •••• {{ card.lastDigits }}
                  </div>
                  <div :class="$style.cardMeta">
                    <span :class="$style.cardDueDate">
                      <Calendar :size="12" />
                      Vence {{ card.dueDate }}
                    </span>
                  </div>
                </div>
              </div>
              <div :class="$style.cardLimit">
                <div :class="$style.limitInfo">
                  <span>Disponível</span>
                  <strong>{{ formatCurrency(card.available) }}</strong>
                </div>
                <div :class="$style.limitBar">
                  <div
                    :class="$style.limitProgress"
                    :style="{
                      width: `${((card.limit - card.available) / card.limit) * 100}%`,
                    }"
                  ></div>
                </div>
                <div :class="$style.limitLabels">
                  <span>R$ 0</span>
                  <span>{{ formatCurrency(card.limit) }}</span>
                </div>
              </div>
              <div :class="$style.cardActions">
                <button :class="$style.cardAction" @click.stop="payCard(card)">
                  <DollarSign :size="14" />
                  <span>Pagar</span>
                </button>
                <button :class="$style.cardAction" @click.stop="lockCard(card)">
                  <Lock :size="14" />
                  <span>{{
                    card.status === "active" ? "Bloquear" : "Desbloquear"
                  }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  TimeScale,
  Filler,
} from "chart.js";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../composables/useToast";
import DashboardCard from "../../components/DashboardCard";
import Sidebar from "../../components/SideBar";
import Button from "../../components/Button";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  TimeScale,
  Filler,
);

const authStore = useAuthStore();
const { info: showInfo } = useToast();

interface CreditCard {
  id: number;
  lastDigits: string;
  dueDate: string;
  limit: number;
  available: number;
  status: "active" | "blocked";
}

const isMobile = ref(false);
const showMobileSidebar = ref(false);
const windowWidth = ref(window.innerWidth);

const checkMobile = () => {
  windowWidth.value = window.innerWidth;
  isMobile.value = windowWidth.value < 768;

  if (!isMobile.value) {
    showMobileSidebar.value = false;
  }
};

const toggleSidebar = () => {
  if (isMobile.value) {
    showMobileSidebar.value = !showMobileSidebar.value;
  }
};

const userData = computed(() => authStore.user);
const userName = computed(() => userData.value?.name || "Lucas Souza");
const userAccountNumber = computed(
  () => userData.value?.accountNumber || "00012345-6",
);
const userBranch = computed(() => userData.value?.branch || "0001");
const userTier = computed(() => userData.value?.tier || "Black");

const balance = ref({
  account: 12543.75,
  investments: 34200.0,
  profit: 1240.5,
  creditLimit: 25000.0,
  creditUsed: 8450.25,
  creditAvailable: 16549.75,
  totalPatrimony: 46743.75,
  investmentsGrowth: 2.8,
  totalGrowth: 8.7,
});

const currentTime = ref("");
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
});

const creditCards = ref<CreditCard[]>([
  {
    id: 1,
    lastDigits: "4321",
    dueDate: "10/12",
    limit: 15000.0,
    available: 11000.0,
    status: "active",
  },
  {
    id: 2,
    lastDigits: "8765",
    dueDate: "15/12",
    limit: 10000.0,
    available: 10000.0,
    status: "active",
  },
]);

const timePeriods = [
  { label: "1M", value: "month" },
  { label: "6M", value: "sixMonths" },
  { label: "1A", value: "year" },
  { label: "5A", value: "fiveYears" },
];
const activePeriod = ref("year");

const chartData = computed(() => {
  const baseData = [
    35000, 37000, 39000, 40000, 42000, 43000, 44000, 45000, 45500, 46000, 46500,
    46743,
  ];
  const labels = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return {
    labels: isMobile.value
      ? labels.map((label, i) => (i % 2 === 0 ? label : ""))
      : labels,
    datasets: [
      {
        label: "Patrimônio Total",
        data: baseData,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: isMobile.value ? 3 : 4,
        pointHoverRadius: isMobile.value ? 5 : 6,
      },
    ],
  };
});

const chartOptionsMobile = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0",
      borderColor: "#475569",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 6,
      bodyFont: { size: 12 },
      titleFont: { size: 11 },
      callbacks: {
        label: (context: any) => `R$ ${context.raw.toLocaleString("pt-BR")}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#64748b",
        font: { size: 10 },
        maxRotation: 0,
      },
    },
    y: {
      grid: {
        color: "rgba(226, 232, 240, 0.3)",
        drawBorder: false,
      },
      ticks: {
        color: "#64748b",
        callback: (value: any) => `R$ ${(value / 1000).toFixed(0)}k`,
        font: { size: 10 },
        padding: 5,
      },
      border: { dash: [4, 4] },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0",
      borderColor: "#475569",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: any) => `R$ ${context.raw.toLocaleString("pt-BR")}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#64748b",
        font: { size: 12 },
      },
    },
    y: {
      grid: {
        color: "rgba(226, 232, 240, 0.3)",
        drawBorder: false,
      },
      ticks: {
        color: "#64748b",
        callback: (value: any) => `R$ ${(value / 1000).toFixed(0)}k`,
        font: { size: 12 },
      },
      border: { dash: [4, 4] },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
};

const chartStats = ref({
  high: 46743,
  low: 35000,
  average: 41245,
  change: 8.7,
});

const isLoading = ref(false);

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

const formatPercent = (value: number): string => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const viewCardDetails = (card: CreditCard) => {
  showInfo("Detalhes do Cartão", `Cartão final ${card.lastDigits}`);
};

const payCard = (card: CreditCard) => {
  showInfo("Pagamento", `Pagando fatura do cartão ${card.lastDigits}`);
};

const lockCard = (card: CreditCard) => {
  card.status = card.status === "active" ? "blocked" : "active";
  showInfo(
    `Cartão ${card.status === "active" ? "desbloqueado" : "bloqueado"}`,
    `Cartão final ${card.lastDigits} ${card.status === "active" ? "desbloqueado" : "bloqueado"} com sucesso`,
  );
};

const changeTimePeriod = (period: string) => {
  activePeriod.value = period;
  showInfo("Período Alterado", `Mostrando dados de ${period}`);
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  updateTime();
  const timer = setInterval(updateTime, 60000);

  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);

  checkMobile();
  window.addEventListener("resize", checkMobile);

  onUnmounted(() => {
    clearInterval(timer);
    window.removeEventListener("resize", checkMobile);
  });
});
</script>

<style module lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);

  @media (min-width: 769px) {
    position: fixed;
    transform: translateX(0);
    height: 100vh;
    flex-shrink: 0;
  }

  &.show {
    transform: translateX(0);
  }
}

.content {
  flex: 1;
  padding: 16px;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  margin-left: 0;

  @media (min-width: 769px) {
    padding: 24px;
    margin-left: 280px;
    width: calc(100% - 280px);
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
}

.header {
  background: white;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
}

.headerTop {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    gap: 16px;
  }
}

.menuButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  border: none;
  color: #475569;
  cursor: pointer;
  flex-shrink: 0;

  @media (min-width: 769px) {
    display: none;
  }

  &:hover {
    background: #e2e8f0;
  }
}

.userInfo {
  flex: 1;
  min-width: 0;
}

.greeting {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 24px;
    }
  }
}

.timeInfo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  font-size: 12px;
  color: #8b5cf6;
  font-weight: 500;
  width: fit-content;

  svg {
    color: #8b5cf6;
  }
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.tierBadge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #12110e 0%, #232221 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  flex-shrink: 0;

  svg {
    color: white;
  }
}

.headerActions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.clientSince {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 12px 0;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
}

.cardsSection {
  margin-bottom: 24px;
}

.cardsGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.chartSection {
  margin-bottom: 24px;
}

.chartCard {
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    padding: 24px;
  }
}

.chartHeader {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }
}

.chartSubtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.chartControls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.timeFilters {
  display: flex;
  gap: 4px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 12px;
  flex-wrap: wrap;
}

.timeFilter {
  padding: 6px 10px;
  border: none;
  background: none;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #0f172a;
    background: rgba(255, 255, 255, 0.8);
  }

  &.active {
    background: white;
    color: #0f172a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.chartContainer {
  height: 240px;
  position: relative;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    height: 280px;
    margin-bottom: 20px;
  }
}

.chartStats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;

  @media (min-width: 768px) {
    gap: 24px;
  }
}

.statItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statLabel {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 12px;
  }
}

.statValue {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.creditCardSection {
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    padding: 24px;
  }
}

.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.cardSubtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.addButton {
  flex-shrink: 0;
}

.creditCards {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
}

.creditCard {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 16px;
  padding: 16px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;

  @media (min-width: 768px) {
    padding: 20px;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.cardContent {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cardHeaderInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cardIcon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #60a5fa;
  flex-shrink: 0;

  svg {
    color: #60a5fa;
  }
}

.cardInfo {
  flex: 1;
  min-width: 0;
}

.cardNumber {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 18px;
  }
}

.cardMeta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cardDueDate {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;

  svg {
    color: #94a3b8;
  }

  @media (min-width: 768px) {
    font-size: 12px;
  }
}

.cardLimit {
  width: 100%;
}

.limitInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  span {
    font-size: 12px;
    color: #94a3b8;

    @media (min-width: 768px) {
      font-size: 13px;
    }
  }

  strong {
    font-size: 18px;
    font-weight: 700;

    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
}

.limitBar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.limitProgress {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.limitLabels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #94a3b8;

  @media (min-width: 768px) {
    font-size: 11px;
  }
}

.cardActions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 12px;
  }
}

.cardAction {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  svg {
    color: #e2e8f0;
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
}

@media (max-width: 360px) {
  .content {
    padding: 12px;
  }

  .header,
  .chartCard,
  .creditCardSection {
    padding: 12px;
  }

  .greeting h1 {
    font-size: 18px;
  }

  .chartContainer {
    height: 200px;
  }
}
</style>
