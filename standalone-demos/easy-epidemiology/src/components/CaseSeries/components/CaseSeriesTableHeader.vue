<template>
  <thead>
    <tr>

      <th rowspan="2" class="header-item">{{ $t('caseSeries.table.headers.factor') }}</th>
      <th colspan="3" class="header-group-case">{{ $t('caseSeries.table.headers.caseGroup') }}</th>
      <th rowspan="2" class="header-stat">{{ $t('caseSeries.table.headers.incidence') }}</th>
    </tr>
    <tr>
      <th class="header-sub">{{ $t('caseSeries.table.headers.exposed') }}</th>
      <th class="header-sub">{{ $t('caseSeries.table.headers.unexposed') }}</th>
      <th class="header-sub">{{ $t('caseSeries.table.headers.total') }}</th>
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
  top: 0;
  z-index: 1;
}

.header-item {
  width: 25%;
  background-color: #f1f3f4;
}

.header-group-case {
  background-color: #e8f0fe;
  color: #1967d2;
}

.header-stat {
  width: 15%;
  background-color: #f8f9fa;
  color: #495057;
}

.header-sub {
  font-size: 0.9em;
  font-weight: normal;
  background-color: #f8f9fa;
  color: #5f6368;
}
</style>
