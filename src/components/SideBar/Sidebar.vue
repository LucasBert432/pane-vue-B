<template>
  <aside :class="[$style.sidebar, { [$style.mobileOpen]: isMobileOpen }]">
    <!-- Overlay para mobile -->
    <div
      v-if="isMobile && isMobileOpen"
      :class="$style.mobileOverlay"
      @click="toggleMobileSidebar"
    ></div>

    <div :class="$style.sidebarInner">
      <!-- Header -->
      <div :class="$style.sidebarHeader">
        <div :class="$style.logoWrapper">
          <svg
            width="120"
            height="48"
            viewBox="0 0 120 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="$style.logo"
          >
            <path
              d="M24 12C24 5.37258 29.3726 0 36 0H84C90.6274 0 96 5.37258 96 12V36C96 42.6274 90.6274 48 84 48H36C29.3726 48 24 42.6274 24 36V12Z"
              fill="white"
            />
            <path
              d="M44 16H40V32H44V16ZM52 16H48V32H52V16ZM60 16H56V32H60V16ZM68 16H64V32H68V16ZM76 16H72V32H76V16Z"
              fill="#111827"
            />
            <path
              d="M36 8C36 5.79086 37.7909 4 40 4H80C82.2091 4 84 5.79086 84 8V40C84 42.2091 82.2091 44 80 44H40C37.7909 44 36 42.2091 36 40V8Z"
              fill="#111827"
            />
            <text
              x="60"
              y="28"
              text-anchor="middle"
              fill="white"
              font-family="Arial, sans-serif"
              font-weight="bold"
              font-size="10"
            >
              BTG Pactual
            </text>
          </svg>
          <button
            v-if="isMobile"
            :class="$style.mobileCloseBtn"
            @click="toggleMobileSidebar"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- User Info -->
        <div :class="$style.userInfo" @click="goToProfile">
          <div :class="$style.userAvatar">
            <span>{{ userInitials }}</span>
            <div
              :class="[$style.statusDot, { [$style.online]: isOnline }]"
            ></div>
          </div>
          <div :class="$style.userDetails">
            <strong :class="$style.userName">{{ userName }}</strong>
            <span :class="$style.userAccount">Conta: {{ userAccount }}</span>
            <div :class="$style.userTier">
              <Crown :size="12" />
              <span>{{ userTier }}</span>
            </div>
          </div>
          <ChevronRight :size="16" :class="$style.chevron" />
        </div>
      </div>

      <!-- Navigation -->
      <nav :class="$style.navigation">
        <div :class="$style.menuSection">
          <span :class="$style.sectionLabel">GERAL</span>
        </div>

        <RouterLink
          to="/home"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path === '/home' },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <LayoutDashboard :size="20" />
          </div>
          <span>Dashboard</span>
          <div
            v-if="$route.path === '/home'"
            :class="$style.activeIndicator"
          ></div>
        </RouterLink>

        <RouterLink
          to="/investments"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path.includes('/investments') },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <TrendingUp :size="20" />
          </div>
          <span>Investimentos</span>
          <div :class="$style.badge" v-if="pendingInvestments > 0">
            <span>{{ pendingInvestments }}</span>
          </div>
        </RouterLink>

        <RouterLink
          to="/credit-card"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path.includes('/credit-card') },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <CreditCard :size="20" />
          </div>
          <span>Cartões</span>
          <div :class="$style.badge" v-if="creditCardAlerts > 0">
            <span>{{ creditCardAlerts }}</span>
          </div>
        </RouterLink>

        <RouterLink
          to="/transfers"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path.includes('/transfers') },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <Send :size="20" />
          </div>
          <span>Transferências</span>
        </RouterLink>

        <div :class="$style.menuSection">
          <span :class="$style.sectionLabel">CONTA</span>
        </div>

        <RouterLink
          to="/profile"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path.includes('/profile') },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <User :size="20" />
          </div>
          <span>Perfil</span>
        </RouterLink>

        <RouterLink
          to="/settings"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path.includes('/settings') },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <Settings :size="20" />
          </div>
          <span>Configurações</span>
        </RouterLink>

        <RouterLink
          to="/support"
          :class="[
            $style.menuItem,
            { [$style.active]: $route.path.includes('/support') },
          ]"
          @click="closeMobileIfOpen"
        >
          <div :class="$style.menuIcon">
            <HelpCircle :size="20" />
          </div>
          <span>Ajuda & Suporte</span>
        </RouterLink>

        <!-- Quick Actions -->
        <div :class="$style.quickActions">
          <button
            :class="$style.quickAction"
            @click="handleQuickAction('transfer')"
          >
            <Send :size="16" />
            <span>Transferir</span>
          </button>
          <button
            :class="$style.quickAction"
            @click="handleQuickAction('deposit')"
          >
            <PlusCircle :size="16" />
            <span>Depositar</span>
          </button>
        </div>
      </nav>

      <!-- Footer -->
      <div :class="$style.sidebarFooter">
        <div :class="$style.logoutButton" @click="handleLogout">
          <div :class="$style.menuIcon">
            <LogOut :size="20" />
          </div>
          <span>Sair</span>
        </div>

        <div :class="$style.footerInfo">
          <div :class="$style.version">
            <span>v{{ appVersion }}</span>
          </div>
          <div :class="$style.footerLinks">
            <a href="#" @click.prevent="showTerms">Termos</a>
            <span>•</span>
            <a href="#" @click.prevent="showPrivacy">Privacidade</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Toggle Button -->
    <button
      v-if="isMobile"
      :class="$style.mobileToggleBtn"
      @click="toggleMobileSidebar"
    >
      <Menu :size="24" />
      <span v-if="hasNotifications" :class="$style.notificationDot"></span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/composables/useToast";
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Send,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Crown,
  PlusCircle,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { info: showInfo } = useToast();

const isMobileOpen = ref(false);
const isOnline = ref(navigator.onLine);
const pendingInvestments = ref(4);
const creditCardAlerts = ref(2);

// User data
const userData = computed(() => authStore.user);
const userInitials = computed(() => {
  const name = userData.value?.name || "Usuário";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
const userName = computed(() => userData.value?.name || "Fabricia Silva");
const userAccount = computed(
  () => userData.value?.accountNumber || "00012345-6",
);
const userTier = computed(() => userData.value?.tier || "Black");
const appVersion = import.meta.env.VITE_APP_VERSION || "2.4.1";

// Mobile detection
const isMobile = ref(false);
const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) {
    isMobileOpen.value = false;
  }
};

// Notifications
const hasNotifications = computed(
  () => pendingInvestments.value > 0 || creditCardAlerts.value > 0,
);

// Methods
const toggleMobileSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value;
};

const closeMobileIfOpen = () => {
  if (isMobile.value) {
    isMobileOpen.value = false;
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    showInfo("Logout realizado", "Até logo!");
    router.push("/");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

const goToProfile = () => {
  router.push("/profile");
  closeMobileIfOpen();
};

const handleQuickAction = (action: string) => {
  closeMobileIfOpen();
  switch (action) {
    case "transfer":
      router.push("/transfers");
      showInfo("Transferência", "Redirecionando para transferências...");
      break;
    case "deposit":
      showInfo("Depósito", "Funcionalidade em desenvolvimento");
      break;
  }
};

const showTerms = () => {
  showInfo("Termos de Uso", "Redirecionando para os termos...");
};

const showPrivacy = () => {
  showInfo(
    "Política de Privacidade",
    "Redirecionando para política de privacidade...",
  );
};

// Lifecycle
onMounted(() => {
  updateMobileStatus();
  window.addEventListener("resize", updateMobileStatus);
  window.addEventListener("online", () => (isOnline.value = true));
  window.addEventListener("offline", () => (isOnline.value = false));
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMobileStatus);
  window.removeEventListener("online", () => (isOnline.value = true));
  window.removeEventListener("offline", () => (isOnline.value = false));
});
</script>

<style module lang="scss">
.sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 50;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 20% 80%,
        rgba(255, 255, 255, 0.03) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.02) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
}

.sidebarInner {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;
}

.sidebarHeader {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logoWrapper {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: #ffffff;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
}

.mobileCloseBtn {
  display: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);

    .chevron {
      opacity: 1;
      transform: translateX(2px);
    }
  }
}

.userAvatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  position: relative;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.statusDot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #64748b;
  border: 2px solid #0f172a;

  &.online {
    background: #10b981;
  }
}

.userDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.userName {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.userAccount {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 400;
}

.userTier {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  margin-top: 4px;
  width: fit-content;

  svg {
    fill: #fbbf24;
  }
}

.chevron {
  opacity: 0.5;
  transition: all 0.2s;
}

.navigation {
  flex: 1;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.menuSection {
  padding: 16px 24px 8px;
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:first-child {
    border-top: none;
    margin-top: 0;
  }
}

.sectionLabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.5;
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  position: relative;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border-left-color: #60a5fa;

    .menuIcon {
      color: #60a5fa;
    }
  }
}

.menuIcon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s ease;
}

.activeIndicator {
  position: absolute;
  right: 16px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.badge {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  margin-left: auto;
}

.quickActions {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  margin-top: 16px;
}

.quickAction {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.sidebarFooter {
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logoutButton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateX(4px);
  }

  .menuIcon {
    color: #ef4444;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
}

.footerInfo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version {
  text-align: center;
  font-size: 11px;
  opacity: 0.4;
  font-weight: 400;
}

.footerLinks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  opacity: 0.5;

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: white;
      text-decoration: underline;
    }
  }

  span {
    opacity: 0.3;
  }
}

// Mobile styles
.mobileToggleBtn {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 49;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  position: relative;

  &:hover {
    background: #1e293b;
    transform: scale(1.05);
  }
}

.notificationDot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.mobileOverlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 48;
  backdrop-filter: blur(2px);
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &.mobileOpen {
      transform: translateX(0);
      left: 0;
    }
  }

  .mobileToggleBtn,
  .mobileCloseBtn,
  .mobileOverlay {
    display: block;
  }

  .mobileOverlay {
    display: block;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 100vw;
    max-width: 300px;
  }

  .mobileToggleBtn {
    top: 16px;
    left: 16px;
    padding: 10px;
  }
}

// Scrollbar styling
.navigation::-webkit-scrollbar {
  width: 4px;
}

.navigation::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.navigation::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
