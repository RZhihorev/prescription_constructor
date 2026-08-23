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