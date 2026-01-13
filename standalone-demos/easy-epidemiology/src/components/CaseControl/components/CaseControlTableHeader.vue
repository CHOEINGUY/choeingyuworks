<template>
  <thead>
    <tr>

      <th rowspan="2" class="header-item">{{ $t('caseControl.table.headers.factor') }}</th>
      <th colspan="3" class="header-group-case">{{ $t('caseControl.table.headers.caseGroup') }}</th>
      <th colspan="3" class="header-group-control">{{ $t('caseControl.table.headers.controlGroup') }}</th>
      <th rowspan="2" class="header-stat whitespace-pre-line">{{ $t('caseControl.table.headers.pvalue') }}</th>
      <th rowspan="2" class="header-stat whitespace-pre-line">{{ $t('caseControl.table.headers.oddsRatio') }}</th>
      <th colspan="2" class="header-stat">{{ $t('caseControl.table.headers.ci') }}</th>
    </tr>
    <tr>

      <th class="header-sub">{{ $t('caseControl.table.headers.exposed') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.unexposed') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.total') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.exposed') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.unexposed') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.total') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.lower') }}</th>
      <th class="header-sub">{{ $t('caseControl.table.headers.upper') }}</th>
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

/* 첫 번째 헤더 행 */
tr:first-child th {
  top: 0;
  z-index: 2;
}

/* 두 번째 헤더 행 */
tr:nth-child(2) th {
  top: 33px; 
  z-index: 1;
}

/* 헤더 그룹 스타일 */
.header-item {
  width: 14%;
  background-color: #f1f3f4;
}
.header-group-case {
  width: 25%;
  background-color: #e8f0fe;
  color: #1967d2;
}
.header-group-control {
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
