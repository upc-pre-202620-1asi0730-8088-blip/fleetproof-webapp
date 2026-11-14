<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useReportingStore } from '../../application/reporting.store.js';
import { useResolutionStore } from '../../../fleet-management/application/resolution.store.js';
import { ResolutionCase } from '../../../fleet-management/domain/model/case.entity.js';
import { findingsForReport } from '../../domain/model/demo-sources.js';
import { downloadReportPdf } from '../../infrastructure/report-pdf.js';
const route = useRoute(); const router = useRouter(); const { t } = useI18n(); const toast = useToast();
const store = useReportingStore(); const resolution = useResolutionStore();
const report = computed(() => store.reports.find(item => String(item.id) === route.params.id));
const findings = computed(() => report.value ? findingsForReport(report.value) : []);
const downloadable = computed(() => report.value?.status === 'published');
const comparisonVisible = ref(false);
const previous = computed(() => store.reports.filter(item => item.plate === report.value?.plate && item.id !== report.value?.id && item.requestedAt < report.value?.requestedAt).sort((a,b) => b.requestedAt.localeCompare(a.requestedAt))[0]);
const differences = computed(() => previous.value ? findings.value.map((item, index) => ({source: item.source, before: findingsForReport(previous.value)[index].result, after: item.result})) : []);
const saving = ref(false);
async function createCase(finding) {
  saving.value = true;
  try {
    await resolution.saveCase(new ResolutionCase({ reportId: report.value.id, plate: report.value.plate, title: finding.summary || finding.result }));
    router.push('/app/cases');
  } catch { toast.add({ severity: 'error', summary: t('common.error'), life: 4000 }); }
  finally { saving.value = false; }
}
onMounted(store.fetchReports);
async function download() {
  saving.value = true;
  try { await downloadReportPdf(report.value); }
  catch { toast.add({severity: 'error', summary: t('common.error'), life: 4000}); }
  finally { saving.value = false; }
}
</script>
<template>
  <router-link to="/app/reports" class="back-link"><i class="pi pi-arrow-left"></i>{{ t('common.back') }}</router-link>
  <pv-message v-if="store.error" severity="error">{{ t(store.error) }}<pv-button text :label="t('common.retry')" @click="store.fetchReports" /></pv-message>
  <p v-else-if="store.loading" role="status">{{ t('common.loading') }}</p>
  <template v-else-if="report">
    <div class="page-heading"><div><h1>{{ report.plate }} · {{ t('report.detail') }}</h1><p v-if="report.make || report.model">{{ [report.make, report.model].filter(Boolean).join(' ') }}</p></div><div class="heading-actions"><pv-button :label="t('workspaceUi.compare')" icon="pi pi-clone" outlined @click="comparisonVisible = true" /><pv-button :label="t('workspaceUi.download')" icon="pi pi-download" :loading="saving" :disabled="!downloadable" @click="download" /></div></div>
    <div class="report-grid"><section>
    <section class="data-panel"><div class="panel-heading"><h2>{{ t('report.checklist') }}</h2></div>
      <p v-if="!report.findings.length" class="empty-state">{{ t('report.none') }}</p>
      <article v-for="(finding, index) in findings" :key="index" class="finding">
        <div class="finding-heading"><h3>{{ finding.source }}</h3><time>{{ finding.dateChecked }}</time></div>
        <p>{{ finding.result }}</p><p class="secondary">{{ finding.summary }}</p>
        <div class="finding-links"><template v-if="!finding.simulated"><a :href="finding.sourceUrl" target="_blank" rel="noopener noreferrer">{{ t('report.source') }} <i class="pi pi-external-link"></i></a><a :href="finding.evidence" target="_blank" rel="noopener noreferrer">{{ t('report.evidence') }} <i class="pi pi-external-link"></i></a></template><pv-button :label="t('report.createCase')" icon="pi pi-briefcase" text :disabled="saving" @click="createCase(finding)" /></div>
      </article>
    </section>
    </section><aside class="report-sidebar"><h2>{{ t('report.status') }}</h2><pv-tag :value="report.status === 'published' ? t('workspaceUi.published') : t('status.' + report.status)" /><p>{{ report.requestedAt.slice(0,10) }}</p></aside></div>
  </template>
  <p v-else>{{ t('common.empty') }}</p>
  <pv-dialog v-model:visible="comparisonVisible" modal :header="t('workspaceUi.compare')" class="form-dialog"><p v-if="!previous">{{ t('workspaceUi.noVersion') }}</p><article v-for="item in differences" :key="item.source" class="finding"><h3>{{ item.source }}</h3><p>{{ item.before }} <i class="pi pi-arrow-right"></i> {{ item.after }}</p><pv-tag v-if="item.before === item.after" :value="t('comparisonUi.unchanged')" severity="info" /></article></pv-dialog>
</template>
