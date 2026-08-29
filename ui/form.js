const form = document.getElementById('prescription-form');
const patientBirthdateField = document.getElementById('patient-birthdate');


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


form.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    if (!showBirthdayWarning()) {
        return;
    }

    const prescriptionData = {
        patient_fio: document.getElementById('patient-fio').value,
        patient_birthdate: document.getElementById('patient-birthdate').value,
        doctor_fio: document.getElementById('doctor-fio').value,
        drug_1_form_name_dosage: document.getElementById('drug-1-form-name-dosage').value,
        drug_1_signa: document.getElementById('drug-1-signa').value
    };
    
    try {
        const result = await window.pywebview.api.create_prescription(
            prescriptionData
        );

    if (result.success) {
        alert(result.message);
    } else {
        alert(`Не удалось сформироват рецепт.\n\n${result.message}`);
    }
    } catch (error) {
        console.error('Ошибка при формировании рецепта:', error);

        alert(
            'Не удалось сформировать и сохранить рецепт.\n\n' +
            'Проверьте заполнение полей и доступность рабочего стола.'
        );
    } finally {
        submitButton.disabled = false;
    }
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