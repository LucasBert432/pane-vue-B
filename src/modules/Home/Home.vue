<template>
  <div :class="$style.layout">
    <Sidebar />

    <main :class="$style.content">
      <header :class="$style.header">
        <div>
          <div :class="$style.greeting">
            <h1>{{ greeting }}, {{ userName }} 👋</h1>
            <div :class="$style.timeInfo">
              <Clock :size="14" />
              <span>{{ currentTime }}</span>
            </div>
          </div>
          <p :class="$style.subtitle">
            Agência {{ userBranch }} • Conta {{ userAccountNumber }} • Cliente
            desde {{ userSince }}
          </p>
        </div>

        <div :class="$style.headerActions">
          <div :class="$style.actionButtons">
            <Button
              variant="outline"
              size="sm"
              icon="search"
              iconPosition="left"
              @click="handleSearch"
            >
              Buscar
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="bell"
              iconPosition="left"
              @click="toggleNotifications"
              :class="{ [$style.hasNotifications]: unreadNotifications > 0 }"
            >
              Notificações
              <span
                v-if="unreadNotifications > 0"
                :class="$style.notificationCount"
              >
                {{ unreadNotifications }}
              </span>
            </Button>
          </div>

          <div :class="$style.tierBadge">
            <Crown :size="14" />
            <span>{{ userTier }}</span>
          </div>
        </div>
      </header>

      <!-- Cards de Resumo -->
      <section :class="$style.cardsGrid">
        <DashboardCard
          label="Saldo em conta"
          :value="formatCurrency(balance.account)"
          :icon="'wallet'"
          :trend="2.5"
          :loading="isLoading"
        />

        <DashboardCard
          label="Investimentos"
          :value="formatCurrency(balance.investments)"
          :subtext="`${formatPercent(balance.investmentsGrowth)} este mês`"
          :icon="'trending-up'"
          :trend="balance.investmentsGrowth"
          :loading="isLoading"
          :highlight="balance.investmentsGrowth > 0"
        />

        <DashboardCard
          label="Cartão de Crédito"
          :value="formatCurrency(balance.creditAvailable)"
          :subtext="`Usado: ${formatCurrency(balance.creditUsed)}`"
          :icon="'credit-card'"
          :usage="balance.creditUsed / balance.creditLimit"
          :loading="isLoading"
        />

        <DashboardCard
          label="Patrimônio Total"
          :value="formatCurrency(balance.totalPatrimony)"
          :subtext="`+${formatPercent(balance.totalGrowth)} este ano`"
          :icon="'shield'"
          :trend="balance.totalGrowth"
          :loading="isLoading"
          :highlight="true"
        />
      </section>

      <!-- Conteúdo Principal -->
      <div :class="$style.mainContent">
        <!-- Coluna Esquerda -->
        <div :class="$style.leftColumn">
          <!-- Gráfico Interativo -->
          <div :class="$style.chartCard">
            <div :class="$style.chartHeader">
              <div>
                <h3>Evolução do Patrimônio</h3>
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
                <Button
                  variant="ghost"
                  size="sm"
                  icon="download"
                  @click="exportChart"
                >
                  Exportar
                </Button>
              </div>
            </div>
            <div :class="$style.chartContainer">
              <Line :data="chartData" :options="chartOptions" />
            </div>
            <div :class="$style.chartStats">
              <div :class="$style.statItem">
                <span :class="$style.statLabel">Maior valor</span>
                <strong :class="$style.statValue">{{
                  formatCurrency(chartStats.high)
                }}</strong>
              </div>
              <div :class="$style.statItem">
                <span :class="$style.statLabel">Variação</span>
                <strong
                  :class="[
                    $style.statValue,
                    {
                      [$style.positive]: chartStats.change >= 0,
                      [$style.negative]: chartStats.change < 0,
                    },
                  ]"
                >
                  {{ formatPercent(chartStats.change) }}
                </strong>
              </div>
              <div :class="$style.statItem">
                <span :class="$style.statLabel">Média mensal</span>
                <strong :class="$style.statValue">{{
                  formatCurrency(chartStats.average)
                }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div :class="$style.rightColumn">
          <div :class="$style.creditCardSection">
            <div :class="$style.cardHeader">
              <div>
                <h3>Cartões de Crédito</h3>
                <p :class="$style.cardSubtitle">
                  Limite total: {{ formatCurrency(balance.creditLimit) }}
                </p>
              </div>
              <Button variant="ghost" size="sm" icon="plus">
                Novo cartão
              </Button>
            </div>
            <div :class="$style.creditCards">
              <div
                v-for="card in creditCards"
                :key="card.id"
                :class="$style.creditCard"
                @click="viewCardDetails(card)"
              >
                <div :class="$style.cardHeaderInfo">
                  <div :class="$style.cardIcon">
                    <CreditCard :size="24" />
                  </div>
                  <div>
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
                    <span>Limite disponível</span>
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
                  <button
                    :class="$style.cardAction"
                    @click.stop="payCard(card)"
                  >
                    <DollarSign :size="14" />
                    <span>Pagar</span>
                  </button>
                  <button
                    :class="$style.cardAction"
                    @click.stop="lockCard(card)"
                  >
                    <Lock :size="14" />
                    <span>Bloquear</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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

const userData = computed(() => authStore.user);
const userName = computed(() => userData.value?.name || "Fabricia Silva");
const userAccountNumber = computed(
  () => userData.value?.accountNumber || "00012345-6",
);
const userBranch = computed(() => userData.value?.branch || "0001");
const userSince = computed(() => userData.value?.clientSince || "2020-05-15");
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
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    labels,
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
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
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
        label: (context: any) => {
          return `R$ ${context.raw.toLocaleString("pt-BR")}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 12,
        },
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
        font: {
          size: 12,
        },
      },
      border: {
        dash: [4, 4],
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
});

const chartStats = ref({
  high: 46743,
  low: 35000,
  average: 41245,
  change: 8.7,
});

const unreadNotifications = ref(3);
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

const handleSearch = () => {
  showInfo("Busca", "Funcionalidade em desenvolvimento");
};

const toggleNotifications = () => {
  showInfo(
    "Notificações",
    `Você tem ${unreadNotifications.value} notificações não lidas`,
  );
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
    "Cartão " + (card.status === "active" ? "desbloqueado" : "bloqueado"),
    `Cartão final ${card.lastDigits} ${card.status === "active" ? "desbloqueado" : "bloqueado"} com sucesso`,
  );
};

const changeTimePeriod = (period: string) => {
  activePeriod.value = period;
  showInfo("Período Alterado", `Mostrando dados de ${period}`);
};

const exportChart = () => {
  showInfo("Exportar", "Exportando gráfico...");
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

  return () => clearInterval(timer);
});
</script>

<style module lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.content {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  max-width: calc(100vw - 280px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    line-height: 1.2;
    background: linear-gradient(135deg, #0f172a 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.timeInfo {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  font-size: 13px;
  color: #8b5cf6;
  font-weight: 500;

  svg {
    opacity: 0.8;
  }
}

.subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.headerActions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.actionButtons {
  display: flex;
  gap: 12px;
}

.tierBadge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;

  svg {
    fill: white;
  }
}

.hasNotifications {
  position: relative;
}

.notificationCount {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #f8fafc;
}

.cardsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.mainContent {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.leftColumn {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.rightColumn {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chartCard,
.investmentsCard,
.creditCardSection,
.transactionsCard,
.quickActions,
.insightsCard {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 4px 0;
  }
}

.cardSubtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.chartHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.chartControls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeFilters {
  display: flex;
  gap: 8px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 12px;
}

.timeFilter {
  padding: 6px 12px;
  border: none;
  background: none;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

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
  height: 280px;
  position: relative;
}

.chartStats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.statItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statLabel {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.statValue {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.investmentsList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.investmentItem {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }
}

.investmentIcon {
  margin-right: 16px;
}

.iconWrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.investmentInfo {
  flex: 1;
  min-width: 0;
}

.investmentHeader {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  strong {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.investmentTicker {
  font-size: 12px;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.investmentDetails {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.investmentType {
  font-weight: 500;
}

.investmentPerformance {
  margin-top: 8px;
}

.performanceBar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.performanceFill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.investmentValues {
  text-align: right;
  margin-left: 16px;

  strong {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
  }
}

.profitLoss {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.creditCards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.creditCard {
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.cardHeaderInfo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.cardIcon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #60a5fa;
}

.cardNumber {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 4px;
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
  font-size: 12px;
  color: #94a3b8;
}

.cardLimit {
  margin-bottom: 20px;
}

.limitInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  span {
    font-size: 13px;
    color: #94a3b8;
  }

  strong {
    font-size: 20px;
    font-weight: 700;
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
  font-size: 11px;
  color: #94a3b8;
}

.cardActions {
  display: flex;
  gap: 8px;
}

.cardAction {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.transactionsList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transactionItem {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }
}

.transactionIcon {
  margin-right: 12px;
}

.iconCircle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.creditIcon {
    background: #d1fae5;
    color: #065f46;
  }

  &.debitIcon {
    background: #fee2e2;
    color: #991b1b;
  }
}

.transactionInfo {
  flex: 1;
  min-width: 0;
}

.transactionDescription {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 6px;

  strong {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.transactionCategory {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.transactionMeta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.transactionDate {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.transactionStatus {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;

  &.pendingStatus {
    background: #fef3c7;
    color: #92400e;
  }

  &.completedStatus {
    background: #d1fae5;
    color: #065f46;
  }
}

.transactionAmount {
  font-size: 16px;
  font-weight: 700;
  margin-left: 12px;

  &.creditAmount {
    color: #10b981;
  }

  &.debitAmount {
    color: #0f172a;
  }
}

.transactionsSummary {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.summaryItem {
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    font-size: 13px;
    color: #64748b;
  }

  strong {
    font-size: 18px;
    font-weight: 700;

    &.positive {
      color: #10b981;
    }

    &.negative {
      color: #ef4444;
    }
  }
}

.actionsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.actionButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  span {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
  }
}

.actionIcon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  color: #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.insightsList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insightItem {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;

  &:nth-child(2) {
    border-left-color: #10b981;
  }

  &:nth-child(3) {
    border-left-color: #f59e0b;
  }
}

.insightIcon {
  flex-shrink: 0;
  margin-top: 2px;

  &:first-child {
    color: #8b5cf6;
  }

  &:nth-child(2) {
    color: #10b981;
  }

  &:nth-child(3) {
    color: #f59e0b;
  }
}

.insightItem strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.insightItem p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.infoIcon {
  color: #94a3b8;
  cursor: help;
}

@media (max-width: 1400px) {
  .cardsGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .mainContent {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .content {
    max-width: 100%;
    padding: 24px;
  }

  .cardsGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
  }

  .headerActions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .actionButtons {
    order: 2;
  }

  .tierBadge {
    order: 1;
  }

  .greeting {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .chartControls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .timeFilters {
    justify-content: center;
  }

  .chartStats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .actionsGrid {
    grid-template-columns: repeat(4, 1fr);
  }

  .actionButton {
    padding: 12px;
  }

  .actionIcon {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 16px;
  }

  .greeting h1 {
    font-size: 24px;
  }

  .actionButtons {
    flex-direction: column;
    gap: 8px;
  }

  .actionsGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .investmentItem {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .investmentValues {
    text-align: left;
    margin-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cardActions {
    flex-direction: column;
  }

  .transactionItem {
    flex-wrap: wrap;
  }

  .transactionAmount {
    width: 100%;
    text-align: right;
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
