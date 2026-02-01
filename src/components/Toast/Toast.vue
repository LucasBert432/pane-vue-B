<template>
  <TransitionGroup name="toast">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[$style.toast, $style[toast.type]]"
      @click="removeToast(toast.id)"
    >
      <div :class="$style.icon">
        <svg
          v-if="toast.type === 'success'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 4L12 14.01L9 11.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="toast.type === 'error'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 9L9 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 9L15 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="toast.type === 'warning'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 9V11M12 15H12.01M5.07 19H18.93C20.14 19 20.84 17.71 20.2 16.74L13.27 5.75C12.64 4.79 11.37 4.79 10.74 5.75L3.81 16.74C3.17 17.71 3.87 19 5.07 19Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 16V12M12 8H12.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div :class="$style.content">
        <div :class="$style.title">{{ toast.title }}</div>
        <div v-if="toast.message" :class="$style.message">
          {{ toast.message }}
        </div>
      </div>
      <button :class="$style.close" @click.stop="removeToast(toast.id)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useToastStore } from "../../store/useToastStore";

const toastStore = useToastStore();
const { toasts, removeToast } = toastStore;
</script>

<style module lang="scss">
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 320px;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 9999;
  border-left: 4px solid transparent;

  &:hover {
    transform: translateX(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
}

.icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message {
  font-size: 13px;
  line-height: 1.4;
  color: #6b7280;
}

.close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #111827;
    background: #f3f4f6;
  }
}

// Types
.success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);

  .icon {
    color: #10b981;
  }

  .title {
    color: #065f46;
  }
}

.error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);

  .icon {
    color: #ef4444;
  }

  .title {
    color: #991b1b;
  }
}

.warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);

  .icon {
    color: #f59e0b;
  }

  .title {
    color: #92400e;
  }
}

.info {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);

  .icon {
    color: #3b82f6;
  }

  .title {
    color: #1e40af;
  }
}

// Transitions
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
