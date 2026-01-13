<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.epidemic.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
        {{ $t('manual.epidemic.desc') }}
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.epidemic.sec1.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        {{ $t('manual.epidemic.sec1.desc') }}
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.epidemic.sec2.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        {{ $t('manual.epidemic.sec2.desc') }}
      </p>
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 space-y-2">
        <p v-for="(item, i) in $tm('manual.epidemic.sec2.items')" :key="i">
           <i18n-t :keypath="`manual.epidemic.sec2.items[${i}]`" tag="span">
            <template #title>
              <strong>• {{ $t(`manual.epidemic.sec2.itemTitles[${i}]`) }}</strong>
            </template>
          </i18n-t>
        </p>
      </div>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.epidemic.sec3.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        <i18n-t keypath="manual.epidemic.sec3.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.epidemic.sec3.bolds[0]') }}</strong>
          </template>
          <template #br><br></template>
          <template #bold2>
            <strong>{{ $t('manual.epidemic.sec3.bolds[1]') }}</strong>
          </template>
        </i18n-t>
      </p>
    </div>
  </div>
</template>
