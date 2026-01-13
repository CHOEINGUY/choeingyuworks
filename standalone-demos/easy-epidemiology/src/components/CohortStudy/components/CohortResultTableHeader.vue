<template>
  <thead>
    <tr>

      <th rowspan="2" class="header-item">{{ $t('cohortStudy.table.headers.factor') }}</th>
      <th colspan="3" class="header-group-exposed">
        {{ $t('cohortStudy.table.headers.exposedGroup') }}
      </th>
      <th colspan="3" class="header-group-unexposed">
        {{ $t('cohortStudy.table.headers.unexposedGroup') }}
      </th>
      <th rowspan="2" class="header-stat whitespace-pre-line">{{ $t('cohortStudy.table.headers.pvalue') }}</th>
      <th rowspan="2" class="header-stat whitespace-pre-line">
        {{ $t('cohortStudy.table.headers.rr') }}
      </th>
      <th colspan="2" class="header-stat">{{ $t('cohortStudy.table.headers.ci') }}</th>
    </tr>
    <tr>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.subjects') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.cases') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.incidence') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.subjects') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.cases') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.incidence') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.lower') }}</th>
      <th class="header-sub">{{ $t('cohortStudy.table.headers.upper') }}</th>
    </tr>
  </thead>
</template>

<style scoped>
th {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  position: sticky;
  z-index: 1;
}

tr:first-child th {
  top: 0;
  z-index: 2;
}

tr:nth-child(2) th {
  top: 33px; /* Approximate height of first row */
  z-index: 1;
}

.header-item {
  width: 14%;
  background-color: #f1f3f4;
}

.header-group-exposed {
  width: 25%;
  background-color: #e8f0fe;
  color: #1967d2;
}

.header-group-unexposed {
  width: 25%;
  background-color: #fce8e6;
  color: #c5221f;
}

.header-stat {
  width: 12%;
  background-color: #e6f4ea;
  color: #137333;
}

.header-sub {
  font-size: 0.9em;
  font-weight: normal;
  background-color: #f8f9fa;
  color: #5f6368;
}
</style>
