const form = document.getElementById('prescription-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const prescriptionData = {
        patient_fio: document.getElementById('patient_fio').value,
        patient_birthdate: document.getElementById('patient_birthdate').value,
        doctor_fio: document.getElementById('doctor_fio').value,
        drug_1_form_name_dosage: document.getElementById('drug_1_form_name_dosage').value,
        drug_1_signa: document.getElementById('drug_1_signa').value
    };

    window.pywebview.api.create_prescription(prescriptionData);
});


async function loadAppInfo() {
    try {
        const info = await window.pywebview.api.get_app_info();

        document.getElementById('app-version').textContent =
            `Версия: ${info.app_version}`;

        document.getElementById('build-date').textContent = 
            `Сборка: ${info.build_date}`;

        document.getElementById('app-copyright').textContent = 
            info.copyright;
    } catch (error) {
        console.error('Не удалось загрузить информацию о приложении:', error);
    }
};

window.addEventListener('pywebviewready', loadAppInfo);