from datetime import date, datetime
from docxtpl import DocxTemplate
from pathlib import Path


today = date.today()
d = today.day
m = today.month
y = today.strftime("%y")
current_time = datetime.now().strftime('%H-%M-%S')

patient_fio = 'Иванов И.И.'
patient_birthdate = '01.01.1900'
doctor_fio = 'Разрушовский Г.Т.'
drug_1_form_name_dosage = 'Tab. Doxycyclini 0.1 №60'
drug_1_signa = 'S.: Внутрь по 1 таблетке 2 раза в день 30 дней'

BASE_DIR = Path(__file__).resolve().parent
template_path = BASE_DIR / 'templates/prescription_107-1u_template.docx'
desktop_path = Path.home() / 'Desktop'
output_path = desktop_path / f'{patient_fio} {today} {current_time}.docx'

doc = DocxTemplate(template_path)
doc.render({
    'd': d,
    'm': m,
    'y': y,
    'patient_fio': patient_fio,
    'patient_birthdate': patient_birthdate,
    'doctor_fio': doctor_fio,
    'drug_1_form_name_dosage': drug_1_form_name_dosage,
    'drug_1_signa': drug_1_signa
    })
doc.save(output_path)
