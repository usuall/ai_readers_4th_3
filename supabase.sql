-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

create table praises (
  id bigint generated always as identity primary key,
  to_name text not null check (char_length(to_name) between 1 and 20),
  from_name text not null check (char_length(from_name) between 1 and 20),
  message text not null check (char_length(message) between 1 and 300),
  likes int not null default 0,
  created_at timestamptz not null default now()
);

-- RLS 켜고: 누구나 읽기 + 누구나 쓰기 (수정/삭제는 불가)
alter table praises enable row level security;

create policy "누구나 읽기" on praises
  for select to anon, authenticated using (true);

create policy "누구나 쓰기" on praises
  for insert to anon, authenticated with check (likes = 0);

grant select, insert on praises to anon, authenticated;

-- 하트: 행 수정 권한을 열지 않고 likes 만 +1 하는 함수
create function like_praise(praise_id bigint) returns int
language sql security definer set search_path = '' as $$
  update public.praises set likes = likes + 1 where id = praise_id returning likes;
$$;

grant execute on function like_praise(bigint) to anon, authenticated;
