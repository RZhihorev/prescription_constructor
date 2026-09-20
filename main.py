import sys
from datetime import date, datetime
from pathlib import Path

import webview
from docxtpl import DocxTemplate  # type: ignore[import-untyped]

from constants import APP_VERSION, BUILD_DATE, COPYRIGHT


def get_resource_path(relative_path: str) -> Path:
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        return Path(getattr(sys, '_MEIPASS')) / relative_path

    return Path(__file__).resolve().parent / relative_path


TEMPLATE_PATH_A4 = get_resource_path(
    'templates/prescription_107-1u_template_a4.docx'
)
TEMPLATE_PATH_A6 = get_resource_path(
    'templates/prescription_107-1u_template_a6.docx'
)
HTML_PATH = get_resource_path('ui/form.html')
DESKTOP_PATH = Path.home() / 'Desktop'


class PrescriptionAPI:
    def get_app_info(self) -> dict:
        return {
            'app_version': APP_VERSION,
            'build_date': BUILD_DATE,
            'copyright': COPYRIGHT
        }

    def create_prescription(self, data: dict) -> dict:
        patient_fio = data['patient_fio'].strip()
        patient_birthdate = data['patient_birthdate'].strip()
        doctor_fio = data['doctor_fio'].strip()
        drug_1_form_name_dosage = data['drug_1_form_name_dosage'].strip()
        drug_1_signa = data['drug_1_signa'].strip()
        drug_2_form_name_dosage = data['drug_2_form_name_dosage'].strip()
        drug_2_signa = data['drug_2_signa'].strip()
        drug_3_form_name_dosage = data['drug_3_form_name_dosage'].strip()
        drug_3_signa = data['drug_3_signa'].strip()
        paper_size = data['paper_size'].strip()

        if drug_2_signa:
            drug_2_signa = f'S: {drug_2_signa}'
        if drug_3_signa:
            drug_3_signa = f'S: {drug_3_signa}'

        today = date.today()
        current_time = datetime.now().strftime('%H-%M-%S')

        output_path = (
            DESKTOP_PATH / f'{patient_fio} {today} {current_time}.docx'
        )

        if paper_size == 'A6':
            doc = DocxTemplate(TEMPLATE_PATH_A6)
        elif paper_size == 'A4':
            doc = DocxTemplate(TEMPLATE_PATH_A4)

        context = {
            'd': today.day,
            'm': today.month,
            'y': today.strftime('%y'),
            'patient_fio': patient_fio,
            'patient_birthdate': patient_birthdate,
            'doctor_fio': doctor_fio,
            'drug_1_form_name_dosage': drug_1_form_name_dosage,
            'drug_1_signa': f'S: {drug_1_signa}',
            'drug_2_form_name_dosage': drug_2_form_name_dosage,
            'drug_2_signa': drug_2_signa,
            'drug_3_form_name_dosage': drug_3_form_name_dosage,
            'drug_3_signa': drug_3_signa
            }
        doc.render(context)
        doc.save(output_path)

        return {
            'success': True,
            'message': (
                'Рецепт сохранен на рабочем столе!\n'
                'Важно! Используйте двустороннюю печать'
                )
        }


def center_window(window):
    screen = webview.screens[0]

    x = (screen.width - window.width) // 2
    y = (screen.height - window.height) // 2

    window.move(x, y)


if __name__ == '__main__':
    window = webview.create_window(
        title='Конструктор рецептов 107-1/у',
        url=HTML_PATH.as_uri(),
        js_api=PrescriptionAPI(),
        width=600,
        height=660,
        min_size=(600, 660),
    )

    webview.start(center_window, (window,))
