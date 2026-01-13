<template>
  <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-200">{{ $t('manual.team.title') }}</h2>
    <div class="prose prose-slate max-w-none">
      <p class="text-slate-600 leading-relaxed mb-6">
        <i18n-t keypath="manual.team.desc" tag="span">
          <template #bold>
            <strong>{{ $t('manual.team.centerName') }}</strong>
          </template>
        </i18n-t>
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span class="material-icons-round text-blue-500">code</span> {{ $t('manual.team.devTeam') }}
          </h4>
          <ul class="space-y-2 text-slate-600">
            <li><strong>{{ $t('manual.team.devs.lead.role') }}:</strong> {{ $t('manual.team.devs.lead.name') }}</li>
            <li><strong>{{ $t('manual.team.devs.tech.role') }}:</strong> {{ $t('manual.team.devs.tech.name') }}</li>
          </ul>
        </div>
        
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span class="material-icons-round text-blue-500">email</span> {{ $t('manual.team.inquiry') }}
          </h4>
          <ul class="space-y-2 text-slate-600">
            <li><strong>Tel:</strong> 061-379-2630</li>
            <li><strong>Email:</strong> st15231@naver.com</li>
          </ul>
        </div>
      </div>

      <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 my-8 text-center">
        <p class="font-bold text-blue-900 mb-2">{{ $t('manual.team.thanks.title') }}</p>
        <p class="text-slate-600 italic">
          {{ $t('manual.team.thanks.desc') }}
        </p>
      </div>
    </div>
  </div>
</template>
