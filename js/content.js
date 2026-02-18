const sheetURL =
  "https://docs.google.com/spreadsheets/d/1lCdnYH1rMBAG9mh_9ncNZeFwMvJJebRk8K7f1BRHhxQ/export?format=csv&gid=0";

const patientList = document.getElementById("patientList");
const patientContent = document.getElementById("patientContent");

fetch(sheetURL)
  .then((response) => response.text())
  .then((csv) => {
    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const patients = parsed.data;

    patients.forEach((patient) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");

      btn.textContent = patient.patient_name;
      btn.addEventListener("click", () => {
        renderPatient(patient);

        document
          .querySelectorAll(".sidebar button")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });

      li.appendChild(btn);
      patientList.appendChild(li);
    });
  })
  .catch((err) => {
    console.error("Error loading sheet:", err);
  });

function renderField(label, value) {
  if (!value || value.trim() === "") return "";
  return `
    <div class="field">
      <span class="label">${label}</span>
      <span class="value">${value}</span>
    </div>
  `;
}

function renderSection(title, fieldsHTML) {
  if (!fieldsHTML.trim()) return "";
  return `
    <section class="section">
      <h2>${title}</h2>
      ${fieldsHTML}
    </section>
  `;
}

function renderPatient(patient) {
  const general = `
    ${renderField("Race", patient.race)}
    ${renderField("Gender", patient.gender)}
    ${renderField("Age", patient.age)}
    ${renderField("Date Updated", patient.date_updated)}
  `;

  const emergency = `
    ${renderField("Name", patient.emergency_contact_name)}
    ${renderField("Relationship", patient.emergency_contact_relationship)}
    ${renderField("Contact Method", patient.emergency_contact_method)}
  `;

  const visit = `
    ${renderField("Presenting Complaint", patient.presenting_complaint)}
    ${renderField("Current Symptoms", patient.current_symptoms)}
    ${renderField("Recent Exposures", patient.recent_exposures)}
  `;

  const conditions = `
    ${renderField("Chronic Illness", patient.chronic_illness)}
    ${renderField("Previous Injuries", patient.previous_injuries)}
    ${renderField("Known Allergies", patient.known_allergies)}
    ${renderField("Current Medications", patient.current_medications)}
    ${renderField("Aetheric Abnormalities", patient.aetheric_abnormalities)}
  `;

  patientContent.innerHTML = `
    <header class="patient-header">
      <h1>${patient.patient_name}</h1>
    </header>

    ${renderSection("General Information", general)}
    ${renderSection("Emergency Contact", emergency)}
    ${renderSection("Reason for Visit", visit)}
    ${renderSection("Pre-existing Conditions", conditions)}
  `;
}
