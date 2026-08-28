const form = document.getElementById('prescription-form');
const patientBirthdateField = document.getElementById('patient_birthdate');


function validatePatientBirthdate(value) {
    const birthdateText = value.trim();

    if (!birthdateText) {
        return 'Укажите дату рождения пациента.';
    }

    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(birthdateText)) {
        return (
            'Дата рождения должна быть введена в формате ДД.ММ.ГГГГ.\n\n' +
            'Пример: 07.03.1985'
        );
    }

    const [day, month, year] = birthdateText.split('.').map(Number);
    const birthdate = new Date(year, month - 1, day);

    const isRealDate =
        birthdate.getFullYear() === year &&
        birthdate.getMonth() === month - 1 &&
        birthdate.getDate() === day;

    if (!isRealDate) {
        return 'Указана несуществующая календарная дата';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthdate > today) {
        return 'Дата рождения пациента не может быть в будущем.';
    }

    return '';
}


function showBirthdayWarning() {
    const errorMessage = validatePatientBirthdate(
        patientBirthdateField.value
    );

    if (errorMessage) {
        alert(errorMessage);
        patientBirthdateField.focus();
        patientBirthdateField.select();
        return false;
    }

    return true;
}


form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    if (!showBirthdayWarning()) {
        return;
    }

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