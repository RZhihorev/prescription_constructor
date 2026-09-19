const form = document.getElementById('prescription-form');
const patientBirthdateField = document.getElementById('patient-birthdate');


function showForm107Info() {
    alert(
        "ОСНОВНЫЕ ОГРАНИЧЕНИЯ ФОРМЫ № 107-1/у\n\n" +

        "1. Форма 107-1/у применяется для препаратов, не требующих " +
        "специальных бланков:\n" +
        "• 107/у-НП — для наркотических и психотропных препаратов " +
        "списка II (кроме отдельных исключений);\n" +
        "• 148-1/у-88 — для препаратов ПКУ, психотропных препаратов " +
        "списка III, а также отдельных комбинированных препаратов " +
        "с контролируемыми веществами.\n\n" +

        "2. На одном бланке можно назначить только одно наименование " +
        "препарата, не подлежащего ПКУ, если он относится к группам АТХ:\n" +
        "• N05A — антипсихотические средства;\n" +
        "• N05B — анксиолитики;\n" +
        "• N05C — снотворные и седативные средства;\n" +
        "• N06A — антидепрессанты.\n\n" +

        "3. В остальных допустимых случаях на одном бланке можно назначить " +
        "до 3 лекарственных препаратов.\n\n" +

        "4. Обычный срок действия рецепта — 60 дней со дня оформления. " +
        "При длительном курсовом лечении срок может быть установлен до 1 года.\n\n" +

        "5. Форма 107-1/у не является льготным рецептом. Для бесплатного " +
        "или льготного отпуска дополнительно оформляется рецепт " +
        "по форме 148-1/у-04(л).\n\n" +

        "6. Рецепт по форме 107-1/у является российской национальной формой. " +
        "Его приём за пределами РФ не гарантирован и определяется законодательством " +
        "страны пребывания, правилами аптеки и статусом назначенного препарата.\n\n" +

        "Важно: перед печатью проверьте форму рецепта, требования ПКУ, " +
        "допустимое количество препарата и актуальные нормативные требования."
    );
}


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
        drug_1_signa: document.getElementById('drug-1-signa').value,
        drug_2_form_name_dosage: document.getElementById('drug-2-form-name-dosage').value,
        drug_2_signa: document.getElementById('drug-2-signa').value,
        drug_3_form_name_dosage: document.getElementById('drug-3-form-name-dosage').value,
        drug_3_signa: document.getElementById('drug-3-signa').value,
        paper_size: document.querySelector('input[name="paper-size"]:checked').value
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