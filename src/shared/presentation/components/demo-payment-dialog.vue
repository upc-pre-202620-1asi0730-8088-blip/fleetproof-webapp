<script setup>
import {ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
const props = defineProps({visible:Boolean, busy:Boolean, title:String, description:String, error:String, subscriptionPlan:String, subscriptionAmount:Number});
const emit = defineEmits(['update:visible', 'confirm']);
const {t} = useI18n();
const qr = ref(''), generating = ref(false), qrError = ref('');
let qrRequest = 0;
watch(() => [props.visible, props.subscriptionPlan, props.subscriptionAmount], ([visible, plan]) => {
  qrRequest++;
  qr.value = ''; qrError.value = ''; generating.value = false;
  if (visible && plan) void showQr();
}, {immediate: true});
async function showQr() {
  const request = ++qrRequest;
  generating.value = true; qrError.value = '';
  try {
    const {default: QRCode} = await import('qrcode');
    const payload = props.subscriptionPlan
      ? JSON.stringify({type:'FleetProof subscription demo', provider:'Taypi', plan:props.subscriptionPlan, amount:props.subscriptionAmount, currency:'PEN', payable:false})
      : 'FLEETPROOF DEMO ONLY - NOT A PAYMENT CODE';
    const data = await QRCode.toDataURL(payload, {width:240, margin:4});
    if (request === qrRequest && props.visible) qr.value = data;
  } catch {if (request === qrRequest) qrError.value = t('common.error');}
  finally {if (request === qrRequest) generating.value = false;}
}
</script>
<template>
  <pv-dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal :header="title" class="form-dialog" :closable="!busy" :close-on-escape="!busy" :dismissable-mask="false">
    <div class="payment-demo">
      <p v-if="subscriptionPlan"><strong>{{ t('paymentUi.taypiDemo') }}</strong></p>
      <p>{{ description }}</p><p class="secondary">{{ t('paymentUi.notice') }}</p>
      <pv-button v-if="!qr && (!subscriptionPlan || qrError)" icon="pi pi-qrcode" :label="t('paymentUi.showQr')" :loading="generating" @click="showQr" />
      <p v-if="subscriptionPlan && generating" role="status">{{ t('common.loading') }}</p>
      <figure v-if="qr" class="demo-qr"><img :src="qr" :alt="t('paymentUi.qrAlt')" width="240" height="240" /></figure>
      <pv-message v-if="error || qrError" severity="error">{{ error || qrError }}</pv-message>
      <div class="form-actions"><pv-button :label="t('common.cancel')" outlined :disabled="busy" @click="emit('update:visible', false)" /><pv-button v-if="qr" icon="pi pi-check" :label="t('paymentUi.confirm')" :loading="busy" @click="emit('confirm')" /></div>
    </div>
  </pv-dialog>
</template>
