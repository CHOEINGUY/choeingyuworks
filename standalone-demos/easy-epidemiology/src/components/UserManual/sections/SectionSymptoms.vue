<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.symptoms.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
        {{ $t('manual.symptoms.desc') }}
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.symptoms.sec1.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">{{ $t('manual.symptoms.sec1.desc') }}</p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.symptoms.sec2.title') }}
      </h5>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-600">
        <li v-for="(item, i) in $tm('manual.symptoms.sec2.items')" :key="i">
           <i18n-t :keypath="`manual.symptoms.sec2.items[${i}]`" tag="span">
            <template #bold>
              <strong>{{ $t(`manual.symptoms.sec2.bolds[${i}]`) }}</strong>
            </template>
          </i18n-t>
        </li>
      </ul>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.symptoms.sec3.title') }}
      </h5>
      <div class="bg-white border border-slate-200 rounded-2xl p-6 my-6 relative shadow-sm">
        <div class="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-500 to-emerald-400 rounded-r-full"></div>
        <p class="font-bold text-slate-900 mb-4">{{ $t('manual.symptoms.sec3.boxTitle') }}</p>
        <p class="text-slate-600">
          {{ $t('manual.symptoms.sec3.desc') }}
        </p>
      </div>
    </div>
  </div>
</template>
