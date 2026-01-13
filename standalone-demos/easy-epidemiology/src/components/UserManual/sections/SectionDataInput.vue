<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.dataInput.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-8">
        <i18n-t keypath="manual.dataInput.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.dataInput.desc').includes('엑셀') ? '엑셀(Excel)' : 'Excel' }}</strong>
          </template>
        </i18n-t>
      </p>

      <!-- 2.1 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec1.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">{{ $t('manual.dataInput.sec1.desc') }}</p>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-600">
        <li v-for="(item, i) in $tm('manual.dataInput.sec1.items')" :key="i">
          <i18n-t :keypath="`manual.dataInput.sec1.items[${i}]`" tag="span">
            <template #bold>
              <strong>{{ $t(`manual.dataInput.sec1.bolds[${i}]`) }}</strong>
            </template>
          </i18n-t>
        </li>
      </ul>

      <!-- 2.2 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec2.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">{{ $t('manual.dataInput.sec2.desc') }}</p>
      <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-600">
        <li v-for="(item, i) in $tm('manual.dataInput.sec2.items')" :key="i">
           <i18n-t :keypath="`manual.dataInput.sec2.items[${i}]`" tag="span">
            <template #bold>
              <strong>{{ $t(`manual.dataInput.sec2.bolds[${i}]`) }}</strong>
            </template>
          </i18n-t>
        </li>
      </ul>

      <!-- 2.3 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec3.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">{{ $t('manual.dataInput.sec3.desc') }}</p>
      <div class="bg-white border border-slate-200 rounded-2xl p-6 my-6 relative shadow-sm">
        <div class="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-500 to-emerald-400 rounded-r-full"></div>
        <p class="font-bold text-slate-900 mb-4">{{ $t('manual.dataInput.sec3.boxTitle') }}</p>
        <ol class="list-decimal pl-6 text-slate-600 space-y-1 mb-4">
           <li>
            <i18n-t keypath="manual.dataInput.sec3.steps[0]" tag="span">
              <template #bold><strong>{{ $t('manual.dataInput.sec3.stepBolds[0]') }}</strong></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="manual.dataInput.sec3.steps[1]" tag="span">
              <template #bold><strong>{{ $t('manual.dataInput.sec3.stepBolds[1]') }}</strong></template>
            </i18n-t>
          </li>
          <li>{{ $t('manual.dataInput.sec3.steps[2]') }}</li>
        </ol>
        <p class="text-sm text-slate-500 bg-slate-100 p-3 rounded-lg">
          <i18n-t keypath="manual.dataInput.sec3.tip" tag="span">
            <template #bold><strong>💡 {{ $t('manual.dataInput.sec3.tipBolds[0]') }}</strong></template>
            <template #bold2><strong>{{ $t('manual.dataInput.sec3.tipBolds[1]') }}</strong></template>
          </i18n-t>
        </p>
      </div>

      <!-- 2.4 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec4.title') }}
      </h5>
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
        <h6 class="font-bold text-slate-900 mb-3">{{ $t('manual.dataInput.sec4.import.title') }}</h6>
        <p class="text-slate-600 mb-2">
          <i18n-t keypath="manual.dataInput.sec4.import.desc" tag="span">
            <template #bold><strong>[{{ $t('manual.dataInput.sec4.import.descBold') }}]</strong></template>
          </i18n-t>
        </p>
        <ul class="list-disc pl-6 text-slate-600 text-sm space-y-1">
          <li>
            <i18n-t keypath="manual.dataInput.sec4.import.items[0]" tag="span">
              <template #bold><strong>{{ $t('manual.dataInput.sec4.import.itemBolds[0]') }}</strong></template>
              <template #bold2><strong>{{ $t('manual.dataInput.sec4.import.itemBolds[1]') }}</strong></template>
            </i18n-t>
          </li>
          <li>
             <i18n-t keypath="manual.dataInput.sec4.import.items[1]" tag="span">
              <template #bold><strong>{{ $t('manual.dataInput.sec4.import.itemBolds[2]') }}</strong></template>
            </i18n-t>
          </li>
          <li>{{ $t('manual.dataInput.sec4.import.items[2]') }}</li>
        </ul>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
        <h6 class="font-bold text-slate-900 mb-3">{{ $t('manual.dataInput.sec4.export.title') }}</h6>
        <p class="text-slate-600">
          <i18n-t keypath="manual.dataInput.sec4.export.desc" tag="span">
            <template #bold><strong>[{{ $t('manual.dataInput.sec4.export.descBold') }}]</strong></template>
          </i18n-t>
        </p>
      </div>

      <!-- 2.5 단축키 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec5.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        {{ $t('manual.dataInput.sec5.desc') }}
      </p>
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <li v-for="(item, i) in $tm('manual.dataInput.sec5.items')" :key="i" class="flex items-center gap-2">
            <span class="bg-white border border-slate-300 px-2 py-0.5 rounded font-mono text-xs shadow-sm">{{ $rt(item.key) }}</span> 
            <span>{{ $rt(item.desc) }}</span>
          </li>
        </ul>
      </div>

      <p class="text-slate-600 leading-relaxed mb-4">
        {{ $t('manual.dataInput.sec5.windows') }}
      </p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div class="text-slate-400 text-xs mb-1">{{ $t('manual.dataInput.sec5.shortcuts.copy') }}</div>
          <code class="bg-slate-100 px-2 py-1 rounded text-slate-900 font-bold">Ctrl + C</code>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div class="text-slate-400 text-xs mb-1">{{ $t('manual.dataInput.sec5.shortcuts.paste') }}</div>
          <code class="bg-slate-100 px-2 py-1 rounded text-slate-900 font-bold">Ctrl + V</code>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div class="text-slate-400 text-xs mb-1">{{ $t('manual.dataInput.sec5.shortcuts.undo') }}</div>
          <code class="bg-slate-100 px-2 py-1 rounded text-slate-900 font-bold">Ctrl + Z</code>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div class="text-slate-400 text-xs mb-1">{{ $t('manual.dataInput.sec5.shortcuts.redo') }}</div>
          <code class="bg-slate-100 px-2 py-1 rounded text-slate-900 font-bold">Ctrl + Y</code>
        </div>
      </div>

      <!-- 2.6 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec6.title') }}
      </h5>
      <p class="text-slate-600 leading-relaxed mb-4">
        <i18n-t keypath="manual.dataInput.sec6.desc" tag="span">
          <template #bold><strong><span class="text-red-500 font-bold">{{ $t('manual.dataInput.sec6.bolds[0]') }}</span></strong></template>
          <template #br><br></template>
          <template #bold2><strong>{{ $t('manual.dataInput.sec6.bolds[1]') }}</strong></template>
          <template #bold3><strong>{{ $t('manual.dataInput.sec6.bolds[2]') }}</strong></template>
        </i18n-t>
      </p>

      <!-- 2.7 -->
      <h5 class="flex items-center gap-2 text-xl font-bold text-slate-800 mt-12 mb-4">
        <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {{ $t('manual.dataInput.sec7.title') }}
      </h5>
      <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 my-6 text-center">
        <p class="font-bold text-blue-900 mb-2">{{ $t('manual.dataInput.sec7.cardTitle') }}</p>
        <p class="text-slate-600 italic">{{ $t('manual.dataInput.sec7.cardDesc') }}</p>
      </div>
    </div>
  </div>
</template>
