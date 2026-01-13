<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.report.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
        <i18n-t keypath="manual.report.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.report.descBolds[0]') }}</strong>
          </template>
           <template #br><br></template>
          <template #bold2>
            <strong>{{ $t('manual.report.descBolds[1]') }}</strong>
          </template>
        </i18n-t>
      </p>

      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.report.sec1.title') }}
      </h5>
      <div class="bg-white border border-slate-200 rounded-2xl p-6 my-6 relative shadow-sm">
        <div class="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-500 to-emerald-400 rounded-r-full"></div>
        <ol class="list-decimal pl-6 text-slate-600 space-y-2">
          <li v-for="(item, i) in $tm('manual.report.sec1.items')" :key="i">
            <i18n-t :keypath="`manual.report.sec1.items[${i}]`" tag="span">
              <template #bold>
                 <strong>{{ $t('manual.report.sec1.bolds[0]') }}</strong>
              </template>
              <template #bold2>
                 <strong>{{ $t('manual.report.sec1.bolds[1]') }}</strong>
              </template>
            </i18n-t>
          </li>
        </ol>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 relative my-8">
        <span class="material-icons-round absolute left-6 top-6 text-2xl text-amber-500">warning</span>
        <div class="ml-10">
          <h4 class="text-amber-900 text-lg font-bold mb-2">{{ $t('manual.report.sec2.title') }}</h4>
          <p class="text-amber-800/90 leading-relaxed">
             <i18n-t keypath="manual.report.sec2.desc" tag="span">
              <template #bold>
                 <strong>{{ $t('manual.report.sec2.bolds[0]') }}</strong>
              </template>
              <template #bold2>
                 <strong>{{ $t('manual.report.sec2.bolds[1]') }}</strong>
              </template>
            </i18n-t>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
