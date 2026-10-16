# 칭찬 릴레이 게시판

동료에게 고마운 일을 남기고 함께 보는 게시판입니다. Vite + Supabase로 만들고 Vercel에 배포합니다.

- 받는 사람 / 보내는 사람 / 칭찬 내용 입력 후 "남기기"를 누르면 Supabase에 저장
- 최신순 카드 목록
- 하트(좋아요), 받는 사람 검색, 이번 달 칭찬왕 TOP 5

## 1. Supabase 준비

1. https://supabase.com 에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase.sql` 내용을 붙여넣고 Run을 누릅니다.
3. Project Settings에서 Project URL과 Publishable key(또는 legacy `anon` key)를 복사합니다.

## 2. 로컬 실행

```bash
cp .env.example .env   # 복사한 URL과 키를 .env에 채웁니다
npm install
npm run dev
```

## 3. Vercel 배포

1. 이 폴더를 GitHub 저장소에 push합니다. (`.env`는 `.gitignore`에 있어 올라가지 않습니다.)
2. Vercel에서 Add New > Project로 저장소를 Import합니다. Framework Preset은 Vite로 자동 인식됩니다.
3. Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`를 추가하고 Deploy합니다.

환경변수는 빌드할 때 코드에 들어가므로, 값을 바꾸면 Redeploy가 필요합니다.

## 참고

- Publishable/anon key는 브라우저에 노출되는 것이 정상이며, 실제 권한은 RLS 정책이 막습니다. `service_role`(secret) 키는 절대 넣지 마세요.
- 누구나 읽기/쓰기가 가능하지만 수정·삭제는 막혀 있습니다. 하트는 `like_praise` 함수로 개수만 올릴 수 있습니다.
