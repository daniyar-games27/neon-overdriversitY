from pathlib import Path
import shutil
import sys

root = Path(__file__).resolve().parent

def replace_once(data, old, new, label, errors):
    if old not in data:
        errors.append(label)
        return data
    return data.replace(old, new, 1)

files = {}
errors = []

p = root / "index.html"
if p.exists():
    s = p.read_text(encoding="utf-8")
    s = replace_once(
        s,
        '<div id="daily-list"></div></div>',
        '<div id="daily-list"></div><button id="daily-open-button" class="daily-open-button" type="button">ОТКРЫТЬ ПРОТОКОЛЫ</button></div>',
        "index.html: не найден блок daily-list", errors)
    screen = (
        '    <section id="daily-screen" class="screen">\n'
        '      <div class="menu-panel compact progress-panel daily-screen-panel">\n'
        '        <p class="eyebrow">NEXUS CITY // DAILY OPERATIONS</p>\n'
        '        <h2>ЕЖЕДНЕВНЫЕ ПРОТОКОЛЫ</h2>\n'
        '        <p class="muted">Выполняй задания во время забегов и получай кредиты и опыт.</p>\n'
        '        <div id="daily-screen-list" class="daily-screen-list"></div>\n'
        '        <button id="daily-back" class="secondary" type="button">НАЗАД</button>\n'
        '      </div>\n'
        '    </section>\n\n'
        '    <section id="pause-menu" class="screen">'
    )
    s = replace_once(s, '    <section id="pause-menu" class="screen">', screen,
                    "index.html: не найден pause-menu для вставки экрана", errors)
    files["index.html"] = s
else:
    errors.append("Не найден index.html")

p = root / "interface.js"
if p.exists():
    s = p.read_text(encoding="utf-8")
    old_screens = "'progress-screen','characters-screen'"
    if old_screens not in s:
        errors.append("interface.js: не найдены списки экранов")
    else:
        s = s.replace(old_screens, "'progress-screen','characters-screen','daily-screen'")
    files["interface.js"] = s
else:
    errors.append("Не найден interface.js")

p = root / "main.js"
if p.exists():
    s = p.read_text(encoding="utf-8")
    old = """ if(el('daily-list'))el('daily-list').innerHTML=daily.map(q=>`<div class="daily-row"><span>${q.title} · ${q.reward} CR</span><strong>${q.completed?'ГОТОВО':`${Math.floor(q.progress)}/${q.target}`}</strong><div class="daily-track"><i style="width:${Math.min(100,q.progress/q.target*100)}%"></i></div></div>`).join('');"""
    new = """ const dailyMarkup=daily.map(q=>`<div class="daily-row"><span>${q.title} · ${q.reward} CR</span><strong>${q.completed?'ГОТОВО':`${Math.floor(q.progress)}/${q.target}`}</strong><div class="daily-track"><i style="width:${Math.min(100,q.progress/q.target*100)}%"></i></div></div>`).join('');
 if(el('daily-list'))el('daily-list').innerHTML=dailyMarkup;
 if(el('daily-screen-list'))el('daily-screen-list').innerHTML=dailyMarkup;"""
    s = replace_once(s, old, new, "main.js: не найден код отрисовки daily-list", errors)
    old2 = "bind('progress-button',()=>{renderProgress();showScreen('progress-screen');});bind('progress-back',()=>showScreen('main-menu'));"
    new2 = old2 + "\nbind('daily-open-button',()=>{renderProgress();showScreen('daily-screen');});bind('daily-back',()=>showScreen('main-menu'));"
    s = replace_once(s, old2, new2, "main.js: не найдена привязка progress-button", errors)
    files["main.js"] = s
else:
    errors.append("Не найден main.js")

p = root / "style.css"
if p.exists():
    css = p.read_text(encoding="utf-8")
    if "v0.8: dedicated daily protocols screen" in css:
        errors.append("style.css: исправление уже установлено")
    else:
        css += (
            "\n\n/* v0.8: dedicated daily protocols screen */\n"
            ".daily-open-button{margin-top:10px;padding:11px 12px;border-color:rgba(255,43,155,.45);background:rgba(255,43,155,.09);color:#ff9acb;font-size:10px}\n"
            ".daily-open-button:hover{background:rgba(255,43,155,.18);box-shadow:0 0 18px rgba(255,43,155,.15)}\n"
            ".daily-screen-panel{width:min(520px,100%)}\n"
            ".daily-screen-list{display:grid;gap:12px;max-height:55dvh;overflow:auto;margin:16px 0}\n"
            ".daily-screen-list .daily-row{padding:14px;background:rgba(0,234,255,.045);border:1px solid rgba(0,234,255,.18);font-size:12px}\n"
            ".daily-screen-list .daily-row strong{font-size:10px}\n"
            ".daily-screen-list .daily-track{height:6px}\n"
        )
    files["style.css"] = css
else:
    errors.append("Не найден style.css")

if errors:
    print("ОБНОВЛЕНИЕ НЕ ПРИМЕНЕНО. Причины:")
    for e in errors:
        print(" - " + e)
    input("\nНажми Enter для выхода...")
    sys.exit(1)

backup = root / "_backup_before_daily_protocols"
backup.mkdir(exist_ok=True)
for name in files:
    shutil.copy2(root / name, backup / name)
for name, content in files.items():
    (root / name).write_text(content, encoding="utf-8")

print("ГОТОВО! Добавлен отдельный экран ежедневных протоколов.")
print("Изменены: index.html, main.js, interface.js, style.css")
print("Резервные копии сохранены в _backup_before_daily_protocols")
input("\nНажми Enter для закрытия...")
