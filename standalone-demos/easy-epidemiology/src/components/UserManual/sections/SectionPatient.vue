<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.patient.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
        {{ $t('manual.patient.desc') }}
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.patient.sec1.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">{{ $t('manual.patient.sec1.desc') }}</p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.patient.sec2.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        <i18n-t keypath="manual.patient.sec2.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.patient.sec2.descBold') }}</strong>
          </template>
        </i18n-t>
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.patient.sec3.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        <i18n-t keypath="manual.patient.sec3.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.patient.sec3.descBold') }}</strong>
          </template>
        </i18n-t>
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.patient.sec4.title') }}
      </h5>
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 relative">
        <span class="material-icons-round absolute left-6 top-6 text-2xl text-amber-500">warning</span>
        <div class="ml-10">
          <h4 class="text-amber-900 text-lg font-bold mb-2">{{ $t('manual.patient.sec4.warningTitle') }}</h4>
          <p class="text-amber-800/90 leading-relaxed">
            {{ $t('manual.patient.sec4.warningDesc') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
