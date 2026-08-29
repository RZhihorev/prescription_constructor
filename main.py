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


TEMPLATE_PATH = get_resource_path(
    'templates/prescription_107-1u_template.docx'
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

        today = date.today()
        current_time = datetime.now().strftime('%H-%M-%S')

        output_path = (
            DESKTOP_PATH / f'{patient_fio} {today} {current_time}.docx'
        )

        doc = DocxTemplate(TEMPLATE_PATH)
        context = {
            'd': today.day,
            'm': today.month,
            'y': today.strftime('%y'),
            'patient_fio': patient_fio,
            'patient_birthdate': patient_birthdate,
            'doctor_fio': doctor_fio,
            'drug_1_form_name_dosage': drug_1_form_name_dosage,
            'drug_1_signa': f'S: {drug_1_signa}'
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
        height=430,
        min_size=(600, 430),
    )

    webview.start(center_window, (window,))
