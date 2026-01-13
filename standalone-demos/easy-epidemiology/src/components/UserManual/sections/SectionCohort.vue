<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.cohort.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
         <i18n-t keypath="manual.cohort.desc" tag="span">
            <template #bold>
              <strong>{{ $t('manual.cohort.descBold') }}</strong>
            </template>
         </i18n-t>
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.cohort.sec1.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        <i18n-t keypath="manual.cohort.sec1.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.cohort.sec1.descBold') }}</strong>
          </template>
        </i18n-t>
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.cohort.sec2.title') }}
      </h5>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-600">
        <li v-for="(item, i) in $tm('manual.cohort.sec2.items')" :key="i">
          <i18n-t :keypath="`manual.cohort.sec2.items[${i}]`" tag="span">
            <template #bold>
              <strong>{{ $t(`manual.cohort.sec2.bolds[${i}]`) }}</strong>
            </template>
          </i18n-t>
        </li>
      </ul>
    </div>
  </div>
</template>
