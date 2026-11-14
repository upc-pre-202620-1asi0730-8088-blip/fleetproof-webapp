<script setup>
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSubscriptionStore } from '../../application/subscription.store.js';
import { useVehicleStore } from '../../../vehicle-information/application/vehicle.store.js';
import { useReportingStore } from '../../../report-management/application/reporting.store.js';
import { useMonitoringStore } from '../../../vehicle-monitoring/application/monitoring.store.js';
import DemoPaymentDialog from '../../../shared/presentation/components/demo-payment-dialog.vue';
import { planCatalog } from '../../domain/model/plan-catalog.js';
const store = useSubscriptionStore(), {t, locale} = useI18n();
const vehicles = useVehicleStore(), reports = useReportingStore(), monitoring = useMonitoringStore();
const audience = ref('business'), payment = ref(null), paymentVisible = ref(false), busy = ref(false), error = ref(''), success = ref(false);
const audiences = Object.keys(planCatalog);
const plans = computed(() => Object.entries(planCatalog[audience.value]).map(([plan, amount]) => ({plan, amount})));
const active = computed(() => store.subscriptions.find(item =>
  item.service === 'fleet' && item.status === 'active' && item.paymentStatus === 'completed'));
const money = amount => 'S/ ' + new Intl.NumberFormat(locale.value === 'es' ? 'es-PE' : 'en-US',
  { useGrouping: 'always' }).format(amount);
function isCurrent(plan) { return active.value?.plan === plan && active.value?.audience === audience.value; }
function openPayment(plan, amount) {
  payment.value = {plan, amount, audience:audience.value};
  error.value = ''; success.value = false; paymentVisible.value = true;
}
async function confirmPayment() {
  if (busy.value || !payment.value) return;
  busy.value = true; error.value = '';
  try {
    await store.confirmPlanPayment(payment.value.plan, payment.value.audience);
    paymentVisible.value = false; success.value = true;
  }
  catch {error.value = t('common.error');}
  finally {busy.value = false;}
}
onMounted(async () => {
  vehicles.fetchVehicles(); reports.fetchReports(); monitoring.fetchMonitoring();
  await store.fetchSubscriptions();
  if (active.value) audience.value = active.value.audience;
});
</script>
<template>
  <div class="page-heading"><h1>{{ t('contexts.subscriptions') }}</h1></div>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}</pv-message>
  <pv-message v-if="success" severity="success">{{ t('paymentUi.activated') }}</pv-message>
  <fieldset class="plan-segment">
    <legend>{{ t('planUi.audience') }}</legend>
    <label v-for="item in audiences" :key="item"><input v-model="audience" type="radio" name="plan-audience" :value="item" />{{ t('planUi.' + item) }}</label>
  </fieldset>
  <div class="plan-grid">
    <article v-for="{plan, amount} in plans" :key="plan" class="plan-option" :class="{ 'plan-current': isCurrent(plan) }" :data-plan="plan">
      <h2>{{ t('paymentUi.' + plan) }}</h2>
      <p class="plan-price"><strong>{{ money(amount) }}</strong><span>{{ t('planUi.period.' + plan) }}</span></p>
      <pv-button v-if="!isCurrent(plan)" icon="pi pi-qrcode" :label="t('planUi.choose')" :outlined="plan !== 'monthly'" :disabled="busy" @click="openPayment(plan, amount)" />
      <pv-tag v-else severity="success" :value="t('contexts.active')" />
    </article>
  </div>
  <section class="plan-usage" :aria-label="t('planUi.usage')">
    <h2>{{ t('planUi.usage') }}</h2>
    <div class="metrics"><article class="metric"><span>{{ t('workspaceUi.vehicles') }}</span><strong>{{ vehicles.vehicles.length }} / 50</strong></article><article class="metric"><span>{{ t('nav.reports') }}</span><strong>{{ reports.reports.length }} / 100</strong></article><article class="metric"><span>{{ t('nav.monitoring') }}</span><strong>{{ monitoring.monitorings.filter(item => item.status === 'active').length }} / 25</strong></article></div>
  </section>
  <DemoPaymentDialog v-if="payment" v-model:visible="paymentVisible" :subscription-plan="payment.plan" :subscription-amount="payment.amount" :title="t('paymentUi.subscription')" :description="t('planUi.summary', {plan:t('paymentUi.' + payment.plan), audience:t('planUi.' + payment.audience), price:money(payment.amount)})" :busy="busy" :error="error" @confirm="confirmPayment" />
</template>
