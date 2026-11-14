<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';
import AuthenticationSection from '../../../user-management/presentation/components/authentication-section.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const { t } = useI18n();
const expanded = ref(false);
const menuButton = ref(null);
const navigation = ref(null);
watch(() => route.fullPath, () => { expanded.value = false; });
const items = [
  { key: 'dashboard', icon: 'pi-chart-bar' }, { key: 'vehicles', icon: 'pi-car' },
  { key: 'reports', icon: 'pi-file' },
  { key: 'alerts', icon: 'pi-bell' }, { key: 'cases', icon: 'pi-briefcase' },
  { key: 'subscriptions', icon: 'pi-credit-card' }, { key: 'profile', icon: 'pi-user' }
];
const context = computed(() => items.find(item => route.path.startsWith('/app/' + item.key)));
const label = item => t(item.key === 'profile' ? 'profile.title' : 'nav.' + item.key);
async function openMenu() {
  expanded.value = true;
  await nextTick();
  navigation.value?.querySelector('a')?.focus();
}
function closeMenu() {
  if (!expanded.value) return;
  expanded.value = false;
  menuButton.value?.focus();
}
</script>
<template>
  <div class="app-shell" :class="{ 'app-shell-workspace': !route.meta.public }" @keydown.esc="closeMenu">
  <a class="skip-link" href="#main">{{ t('common.view') }}</a>
  <pv-toast />
  <aside v-if="!route.meta.public" class="workspace-sidebar" :class="{ expanded }">
    <router-link to="/app/dashboard" class="brand" @click="expanded = false"><img src="/fleetproof-logo.svg" alt="" /><span>FleetProof<small>BLIP</small></span></router-link>
    <nav id="app-navigation" ref="navigation" class="primary-navigation" :aria-label="t('common.menu')">
      <router-link v-for="item in items" :key="item.key" :to="'/app/' + item.key" @click="expanded = false"><i :class="'pi ' + item.icon" aria-hidden="true"></i>{{ label(item) }}</router-link>
    </nav>
  </aside>
  <button v-if="expanded && !route.meta.public" type="button" class="workspace-scrim" :aria-label="t('common.menu')" tabindex="-1" @click="closeMenu"></button>
  <header class="app-header">
    <button v-if="!route.meta.public" ref="menuButton" type="button" class="mobile-menu" :aria-label="t('common.menu')" :aria-expanded="expanded" aria-controls="app-navigation" @click="openMenu"><i class="pi pi-bars" aria-hidden="true"></i></button>
    <router-link to="/app/dashboard" class="brand"><img src="/fleetproof-logo.svg" alt="" /><span>FleetProof<small>BLIP</small></span></router-link>
    <span v-if="!route.meta.public" class="workspace-context">{{ context ? label(context) : route.meta.title }}</span>
    <LanguageSwitcher />
    <AuthenticationSection />
  </header>
  <main id="main" class="workspace" :class="{ 'workspace-auth': route.meta.public }" tabindex="-1"><router-view /></main>
  <footer class="app-footer">FleetProof · BLIP</footer>
</div>
</template>
