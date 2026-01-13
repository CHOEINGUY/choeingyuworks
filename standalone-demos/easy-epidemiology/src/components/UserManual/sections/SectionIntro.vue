<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.intro.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-lg leading-relaxed text-slate-600 mb-6">
        <i18n-t keypath="manual.intro.desc1" tag="span">
          <template #bold1>
            <strong>Easy-Epidemiology Web (v2.0)</strong>
          </template>
          <template #bold2>
            <strong>{{ $t('manual.intro.toolType') }}</strong>
          </template>
        </i18n-t>
      </p>
      <div class="bg-blue-50 border border-blue-100 rounded-2xl p-6 my-6">
        <h4 class="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span class="material-icons-round text-blue-500">security</span>
          {{ $t('manual.intro.security.title') }}
        </h4>
        <p class="text-slate-700">
          <i18n-t keypath="manual.intro.security.desc" tag="span">
            <template #bold>
              <strong>{{ $t('manual.intro.security.notTransmit') }}</strong>
            </template>
          </i18n-t>
        </p>
      </div>
      <p class="text-slate-600 leading-relaxed mb-6">
        {{ $t('manual.intro.desc2') }}
      </p>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-600">
        <li v-for="(feature, index) in $tm('manual.intro.features')" :key="index">{{ $rt(feature) }}</li>
      </ul>
    </div>
  </div>
</template>
