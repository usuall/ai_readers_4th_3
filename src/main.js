import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

const form = document.querySelector('#praise-form')
const search = document.querySelector('#search')
const list = document.querySelector('#list')
const ranking = document.querySelector('#ranking')
const template = document.querySelector('#card')
let praises = []

async function load() {
  // ponytail: loads every row; switch to .range() paging + a DB-side ranking view if the board gets big
  const { data, error } = await supabase.from('praises').select('*').order('created_at', { ascending: false })
  if (error) return alert('불러오기 실패: ' + error.message)
  praises = data
  render()
}

function render() {
  const q = search.value.trim()
  list.replaceChildren(...praises.filter((p) => p.to_name.includes(q)).map(card))

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const counts = {}
  for (const p of praises) {
    if (new Date(p.created_at) >= monthStart) counts[p.to_name] = (counts[p.to_name] || 0) + 1
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  ranking.replaceChildren(...top.map(([name, n]) => {
    const li = document.createElement('li')
    li.textContent = `${name} (${n}개)`
    return li
  }))
}

function card(p) {
  const el = template.content.cloneNode(true)
  el.querySelector('.to').textContent = `To. ${p.to_name}`
  el.querySelector('.message').textContent = p.message
  el.querySelector('.from').textContent = `From. ${p.from_name}`
  el.querySelector('time').textContent = new Date(p.created_at).toLocaleString('ko-KR')
  const count = el.querySelector('.heart span')
  count.textContent = p.likes
  el.querySelector('.heart').onclick = async () => {
    const { data, error } = await supabase.rpc('like_praise', { praise_id: p.id })
    if (error) return alert('좋아요 실패: ' + error.message)
    p.likes = count.textContent = data
  }
  return el
}

form.onsubmit = async (e) => {
  e.preventDefault()
  const row = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()]))
  if (!row.to_name || !row.from_name || !row.message) return alert('빈칸을 채워주세요')
  const button = form.querySelector('button')
  button.disabled = true
  const { error } = await supabase.from('praises').insert(row)
  button.disabled = false
  if (error) return alert('저장 실패: ' + error.message)
  form.reset()
  load()
}

search.oninput = render
load()
