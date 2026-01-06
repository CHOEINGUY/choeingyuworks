## TTS 확장 설계 (ECG, 채혈·채뇨, 신체기능) — new.html/new.js

### 목표
- 현재 SNSB-C에만 있는 TTS를 심전도(ECG), 채혈·채뇨(Blood), 신체기능(Physical)에도 적용
- 모달에서 각 검사별 TTS 개별 온·오프 토글 제공 (전체 TTS와 연동)
- 기존 동작(알림음, 블링크, 데이터 주기 갱신)과 충돌 없이 동작

---

### 1) UI: 모달에 TTS 토글 추가 (new.html)
- 아래 체크박스를 기존 모달 섹션에 추가합니다. ID는 스크립트와 일치해야 합니다.

```html
<!-- 기타 검사 섹션 내부에 추가 -->
<div class="setting-item">
  <label>
    <input type="checkbox" id="tts-ecg" checked>
    심전도 TTS 호명
  </label>
  </div>
  <div class="setting-item">
  <label>
    <input type="checkbox" id="tts-blood" checked>
    채혈/채뇨 TTS 호명
  </label>
  </div>
  <div class="setting-item">
  <label>
    <input type="checkbox" id="tts-physical" checked>
    신체기능 TTS 호명
  </label>
</div>
```

- 전체 TTS(`enable-all-tts`) 토글을 변경 시 위 3개 체크박스도 동기화되도록 이벤트 리스너를 보강합니다.

---

### 2) 설정 모델 확장 (new.html script)
- `settings`에 다음 속성을 추가합니다.

```js
let settings = {
  // ...기존
  ttsEcg: true,
  ttsBlood: true,
  ttsPhysical: true,
};
```

- `loadSettings` 유지 (localStorage 병합), `applySettingsToUI`/`saveSettings`/`resetSettings`에 해당 필드 연결:

```js
// applySettingsToUI
document.getElementById('tts-ecg').checked = settings.ttsEcg;
document.getElementById('tts-blood').checked = settings.ttsBlood;
document.getElementById('tts-physical').checked = settings.ttsPhysical;

// saveSettings
settings.ttsEcg = document.getElementById('tts-ecg').checked;
settings.ttsBlood = document.getElementById('tts-blood').checked;
settings.ttsPhysical = document.getElementById('tts-physical').checked;

// resetSettings 기본값에 추가
ttsEcg: true, ttsBlood: true, ttsPhysical: true

// setupSettingsEventListeners (enable-all-tts 연동)
enableAllTts.addEventListener('change', function() {
  document.getElementById('tts-snsbc').checked = this.checked;
  document.getElementById('tts-ecg').checked = this.checked;
  document.getElementById('tts-blood').checked = this.checked;
  document.getElementById('tts-physical').checked = this.checked;
});
```

---

### 3) TTS 실행 제어 확장
- 기존 `speakWithSettings(text, type)`에 검사별 분기를 추가합니다.

```js
function speakWithSettings(text, type = 'general') {
  if (!settings.enableAllTts) return;
  switch (type) {
    case 'snsbc':
      if (!settings.ttsSnsbc) return; break;
    case 'ecg':
      if (!settings.ttsEcg) return; break;
    case 'blood':
      if (!settings.ttsBlood) return; break;
    case 'physical':
      if (!settings.ttsPhysical) return; break;
  }
  speak(text);
}
```

참고: `new.html`의 `speak()`는 `<speak>...</speak>`로 시작하면 태그를 제거한 후 그 문자열을 그대로 읽고, 그 외에는 이름을 두 번 반복하는 형식으로 변환합니다. 따라서 “다음 검사 안내” 문구를 유지하려면 `<speak>...</speak>`로 래핑해 전달해야 합니다.

---

### 4) 트리거 지점: 완료 전환 시 TTS 호출
- 완료 감지는 이미 구현되어 있습니다. 각 검사 완료 블록에 TTS 호출을 추가합니다. 중복 방지를 위해 `recentlyCalled` 캐시를 재사용합니다(60초 쿨다운).

```js
// ECG 완료 시
if (prevRow[idx.심전도] === '검사중' && currentRow[idx.심전도] === '완료') {
  playSoundWithSettings(soundMap.A, 'ecg');
  startBlinking('station-ecg');
  setTimeout(() => {
    if (nextUpData && nextUpData.ecg && nextUpData.ecg !== '-') {
      const nextName = nextUpData.ecg.replace(/<[^>]*>/g, '');
      const callKey = `ecg-${nextName}`;
      if (!recentlyCalled[callKey] || (new Date() - recentlyCalled[callKey] > 60000)) {
        speakWithSettings(`<speak>다음 심전도, ${nextName} 님</speak>`, 'ecg');
        recentlyCalled[callKey] = new Date();
      }
    }
  }, 1000);
}

// 채혈 완료 시
if (prevRow[idx.채혈] === '검사중' && currentRow[idx.채혈] === '완료') {
  playSoundWithSettings(soundMap.A, 'blood');
  startBlinking('station-blood');
  setTimeout(() => {
    if (nextUpData && nextUpData.blood && nextUpData.blood !== '-') {
      const nextName = nextUpData.blood.replace(/<[^>]*>/g, '');
      const callKey = `blood-${nextName}`;
      if (!recentlyCalled[callKey] || (new Date() - recentlyCalled[callKey] > 60000)) {
        speakWithSettings(`<speak>다음 채혈, ${nextName} 님</speak>`, 'blood');
        recentlyCalled[callKey] = new Date();
      }
    }
  }, 1000);
}

// 신체기능 완료 시
if (prevRow[idx.신체기능] === '검사중' && currentRow[idx.신체기능] === '완료') {
  playSoundWithSettings(soundMap.A, 'physical');
  startBlinking('station-physical');
  setTimeout(() => {
    if (nextUpData && nextUpData.physical && nextUpData.physical !== '-') {
      const nextName = nextUpData.physical.replace(/<[^>]*>/g, '');
      const callKey = `physical-${nextName}`;
      if (!recentlyCalled[callKey] || (new Date() - recentlyCalled[callKey] > 60000)) {
        speakWithSettings(`<speak>다음 신체기능, ${nextName} 님</speak>`, 'physical');
        recentlyCalled[callKey] = new Date();
      }
    }
  }, 1000);
}
```

메시지 포맷은 old.html의 스타일을 따릅니다. new.html의 `speak()`가 SSML을 제거해 일반 텍스트로 보내므로 문구가 그대로 낭독됩니다.

---

### 5) 테스트 체크리스트
- 완료 전환 시각에 맞춰 소리 → 블링크 → TTS 순서로 실행되는지 각 검사별 확인
- 모달에서 각 TTS 토글 Off 시 해당 검사 TTS만 비활성화되는지 확인
- `enable-all-tts` Off 시 전 검사 TTS 비활성화되는지 확인 (On 시 각 개별 토글과 동기화됨)
- 60초 내 동일 대상에 대한 중복 TTS 방지 확인

---

### 6) 변경 요약
- 모달: `tts-ecg`, `tts-blood`, `tts-physical` 체크박스 추가
- settings 모델/저장/로드/UI 반영에 3개 필드 연결
- `speakWithSettings`에 `ecg`/`blood`/`physical` 분기 추가
- 완료 전환 블록에서 `nextUp` 기반 TTS 호출 추가(SSML 래핑으로 안내 문구 유지), `recentlyCalled`로 중복 방지


