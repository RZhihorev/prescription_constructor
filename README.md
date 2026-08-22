# Конструктор рецептов 107-1/у
Небольшой Python-проект для автоматического заполнения Word-шаблона рецептурного бланка формы 107-1/у и сохранения готового `.docx`-файла на Рабочем столе Windows.

> Проект предназначен для подготовки документов. Перед использованием в клинической практике необходимо проверить соответствие актуальным нормативным требованиям, корректность шаблона и заполненных данных.

## Возможности
- Заполнение Word-шаблона `.docx` с помощью `docxtpl`.
- Автоматическая подстановка текущих дня, месяца и двух последних цифр года.
- Подстановка данных пациента, врача и лекарственного назначения.
- Добавление времени формирования документа в имя файла.
- Сохранение результата на Рабочем столе пользователя.

## Структура проекта
```text
prescription_constructor/
├── main.py
├── requirements.txt
├── README.md
├── templates/
│   └── prescription_107-1u_template.docx
└── .venv/                      # локальное виртуальное окружение
```

Файл шаблона должен находиться по пути:
```text
templates/prescription_107-1u_template.docx
```

## Установка
1. Создайте и активируйте виртуальное окружение:
```bash
python -m venv .venv
source .venv/Scripts/activate
```

Для PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

2. Установите зависимость:
```bash
pip install docxtpl
```

При наличии `requirements.txt`:
```bash
pip install -r requirements.txt
```

Минимальное содержимое `requirements.txt`:
```text
docxtpl
```

## Настройка шаблона
В Word-шаблоне `templates/prescription_107-1u_template.docx` разместите Jinja-плейсхолдеры `docxtpl` в нужных местах:
```text
{{ d }}
{{ m }}
{{ y }}
{{ patient_fio }}
{{ patient_birthdate }}
{{ doctor_fio }}
{{ drug_1_form_name_dosage }}
{{ drug_1_signa }}
```

Например, дата может быть оформлена так:
```text
«{{ d }}» {{ m }} 20{{ y }} г.
```

Важно: плейсхолдер должен быть набран целиком в одном текстовом фрагменте Word. Если вручную менять шрифт или форматирование внутри `{{ ... }}`, Word может разбить выражение на несколько частей, и `docxtpl` не заменит его корректно.

## Настройка данных
В `main.py` заполните переменные исходными данными:
```python
patient_fio = "Иванов И.И."
patient_birthdate = "01.01.1900"
doctor_fio = "Разрушовский Г.Т."
drug_1_form_name_dosage = "Tab. Doxiciclini 0.1 №60"
drug_1_signa = "S.: Внутрь по 1 таблетке 2 раза в день 30 дней"
```

Текущая дата и время получаются автоматически:
```python
from datetime import date, datetime

today = date.today()
d = today.day
m = today.month
y = today.strftime("%y")
current_time = datetime.now().strftime("%H-%M-%S")
```

- `d` — текущий день;
- `m` — текущий месяц;
- `y` — последние две цифры текущего года;
- `current_time` — время в безопасном для имени файла формате, например `23-16-04`.

## Запуск
Из корневой папки проекта выполните:
```bash
python main.py
```

Либо укажите Python из виртуального окружения явно:
```bash
.venv/Scripts/python.exe main.py
```

## Сохранение результата
Готовый файл сохраняется на Рабочем столе:
```python
from pathlib import Path

desktop_path = Path.home() / "Desktop"
output_path = desktop_path / f"{patient_fio} {today} {current_time}.docx"
```

Пример результата:
```text
Иванов И.И. 2026-08-22 23-16-04.docx
```
В Windows нельзя использовать двоеточие `:` в имени файла. Поэтому время для имени файла необходимо формировать как `%H-%M-%S`, а не как `%H:%M:%S`.

Для более удобного поиска и снижения объёма персональных данных в имени файла рекомендуется формат с внутренним идентификатором пациента:

```text
Рецепт107-1у_МК-123456_2026-08-22_23-16-04.docx
```

## Основная логика
```python
from datetime import date, datetime
from pathlib import Path
from docxtpl import DocxTemplate

today = date.today()
d = today.day
m = today.month
y = today.strftime("%y")
current_time = datetime.now().strftime("%H-%M-%S")

patient_fio = "Иванов И.И."
patient_birthdate = "01.01.1900"
doctor_fio = "Разрушовский Г.Т."
drug_1_form_name_dosage = "Tab. Doxiciclini 0.1 №60"
drug_1_signa = "S.: Внутрь по 1 таблетке 2 раза в день 30 дней"

BASE_DIR = Path(__file__).resolve().parent
template_path = BASE_DIR / "templates" / "prescription_107-1u_template.docx"
desktop_path = Path.home() / "Desktop"
output_path = desktop_path / f"{patient_fio} {today} {current_time}.docx"

if not template_path.is_file():
    raise FileNotFoundError(f"Шаблон не найден: {template_path}")

doc = DocxTemplate(template_path)
doc.render({
    "d": d,
    "m": m,
    "y": y,
    "patient_fio": patient_fio,
    "patient_birthdate": patient_birthdate,
    "doctor_fio": doctor_fio,
    "drug_1_form_name_dosage": drug_1_form_name_dosage,
    "drug_1_signa": drug_1_signa,
})
doc.save(output_path)

print(f"Документ сохранён: {output_path}")
```

## Типичные ошибки
### `PackageNotFoundError: Package not found at ...`
Python не нашёл Word-шаблон. Проверьте:
- существует ли файл `templates/prescription_107-1u_template.docx`;
- совпадает ли имя файла с указанным в `template_path`;
- является ли шаблон настоящим документом `.docx`, а не файлом `.doc` с переименованным расширением.

### `OSError: [Errno 22] Invalid argument`
Обычно возникает при недопустимом символе в имени файла. В Windows запрещены:
```text
\ / : * ? " < > |
```
Не используйте время с двоеточиями (`23:16:04`) в `output_path`; применяйте `%H-%M-%S`.

### Файл не появился на Рабочем столе
При синхронизации Рабочего стола с OneDrive путь может отличаться. В таком случае выведите путь в консоль:
```python
print(desktop_path)
```
и проверьте, существует ли указанная папка.

## Выполнено
- Создано виртуальное окружение.
- Реализована базовая логика заполнения Word-шаблона.
- Настроено сохранение готового документа на Рабочем столе.
- Шаблон рецептурного бланка отредактирован для лучшей читаемости.
