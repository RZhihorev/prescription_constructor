const form = document.getElementById('prescription-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const patientFIO = document.getElementById('patient_fio').value;
    const patientBirthdate = document.getElementById('patient_birthdate').value;
    const doctorFio = document.getElementById('doctor_fio').value;
    const drugFormNameDosage = document.getElementById('drug_1_form_name_dosage').value;
    const drugSigna = document.getElementById('drug_1_signa').value;

    console.log(patientFIO);
    console.log(patientBirthdate);
    console.log(doctorFio);
    console.log(drugFormNameDosage);
    console.log(drugSigna);
})