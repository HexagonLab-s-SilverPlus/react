# Git 커밋 메시지 규칙

효율적인 협업과 코드 추적을 위해 아래의 커밋 메시지 규칙을 준수해주세요.

---

## 커밋 메시지 구조

1. **`<타입>`**: 변경의 목적을 나타내는 키워드 (영어 소문자).
2. **`<짧은 설명>`**: 변경 내용을 간결하게 요약 (50자 이내 권장).
3. **`<구체적인 변경 사항 설명>`**: 필요 시 상세 설명 (wrap 72자 권장).

---

## 커밋 메시지 타입

| 타입         | 설명                                   |
| ------------ | -------------------------------------- |
| **feat**     | 새로운 기능 추가                       |
| **fix**      | 버그 수정                              |
| **refactor** | 코드 리팩토링 (기능 변화 없음)         |
| **style**    | 코드 스타일 변경 (포매팅, 세미콜론 등) |
| **docs**     | 문서 수정                              |
| **test**     | 테스트 코드 추가 또는 수정             |
| **chore**    | 기타 변경 사항 (빌드, 설정 변경 등)    |
| **build**    | 빌드 관련 파일 및 설정 변경            |
| **ci**       | CI/CD 설정 변경                        |
| **perf**     | 성능 개선                              |
| **revert**   | 이전 커밋 되돌리기                     |
| **hotfix**   | 긴급 버그 수정                         |

---

## 3. 작성 규칙

1. **`<타입>`**:

- 커밋 메시지의 첫 번째 단어로 변경 목적을 나타냅니다.
- 소문자로 작성하며, 콜론(`:`)과 공백(` `)을 붙입니다.
- 예: `feat:`, `fix:`.

2. **`<짧은 설명>`**:

- 한글 메시지로 간결하게 변경 사항 요약 (50자 이내 권장).
- 현재형으로 작성: "추가함" 대신 "추가".

3. **`<구체적인 변경 사항 설명>` (선택 사항)**:

- 필요할 경우 변경 내용을 상세히 설명합니다.
- 줄 길이는 72자를 넘지 않도록 합니다.

---

## 4. 커밋 메시지 작성 예시

1. **기능 추가**
   `feat: 사용자 검색 기능 추가`

2. **버그 수정**
   `fix: 이미지 업로드 시 발생하던 오류 수정`

3. **코드 리팩토링**
   `refactor: API 호출 로직 개선`

4. **문서 수정**
   `docs: README.md에 설치 가이드 추가`

5. **테스트 코드 추가**
   `test: 로그인 기능 유닛 테스트 작성`

---

## 5. 참고 사항

1. 커밋 메시지는 **현재형**으로 작성합니다.

- 예: "추가" (O), "추가함" (X)

2. **한글 메시지** 사용 시, 키워드(`feat`, `fix` 등)만 영어로 작성합니다.
3. 메시지를 간결하고 명확하게 작성하여 협업자와의 소통을 원활히 합니다.

---

## 6. 관련 링크

- [Git 커밋 메시지 작성 가이드 (영문)](https://chris.beams.io/posts/git-commit/)
- [Markdown 문법 가이드](https://www.markdownguide.org/)

---

## 7. 기여 가이드

1. 커밋 메시지 규칙을 준수해주세요.

**문의**: 프로젝트 관리자에게 연락: `dev.choiey@gmail.com`
