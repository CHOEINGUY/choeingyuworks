<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.caseSeries.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
        {{ $t('manual.caseSeries.desc').split('{br}')[0] }}
      </p>
      <p class="text-slate-600 leading-relaxed">
        <i18n-t keypath="manual.caseSeries.desc" tag="span">
            <template #br><span class="hidden"></span></template> <!-- Consume br if it exists but we split text so it might be tricky. Actually the desc key has {br}. If I use it directly it renders all. The original had 2 paragraphs. -->
             <!-- Let's just use the full desc. -->
             <template #bold>
                <strong>{{ $t('manual.caseSeries.descBold') }}</strong>
             </template>
        </i18n-t>
      </p>
      
      <!-- Actually the original had 2 paragraphs with hardcoded split. My local key has {br}. I can render it as one <p> with <br> or keep 2 <p>s. 
           If I use i18n-t it renders inside a tag.
           Let's simplify to one paragraph or just render the whole thing.
           Wait, 'desc' in manual.ts has {br}. 
           Korean: '...요약합니다.{br}전체 통계보다는...'
           I can put it in one p tag and use template #br -> <br>.
      -->
    </div>
    
    <!-- Retrying logic for cleaner template -->
    <div class="prose prose-slate max-w-none">
       <p class="text-slate-600 leading-relaxed mb-6">
        <i18n-t keypath="manual.caseSeries.desc" tag="span">
           <template #br><br></template>
           <template #bold>
              <strong>{{ $t('manual.caseSeries.descBold') }}</strong>
           </template>
        </i18n-t>
      </p>
      
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-sm text-slate-600">
        <strong class="text-slate-900 block mb-2">💡 {{ $t('manual.caseSeries.expert.title') }}</strong>
        <ul class="list-disc pl-5 space-y-1">
          <li v-for="(item, i) in $tm('manual.caseSeries.expert.items')" :key="i">
             <i18n-t :keypath="`manual.caseSeries.expert.items[${i}]`" tag="span">
                <template #bold>
                  <strong>{{ $t(`manual.caseSeries.expert.bolds[${i}]`) }}</strong>
                </template>
             </i18n-t>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
