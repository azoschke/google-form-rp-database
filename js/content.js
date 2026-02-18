const sheetURL = "https://docs.google.com/spreadsheets/d/1lCdnYH1rMBAG9mh_9ncNZeFwMvJJebRk8K7f1BRHhxQ/export?format=csv&gid=0";

const patientList = document.getElementById("patientList");
const patientContent = document.getElementById("patientContent");

// Parse CSV from Google Sheets
Papa.parse(sheetURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (results) {
    const patients = results.data;

    if (!patients.length) {
      patientContent.innerHTML = "<p>No patient data found.</p>";
      return;
    }

    // Build sidebar
    patients.forEach((patient) => {
      if (!patient.patient_name) return;

      const li = document.createElement("li");
      const link = document.createElement("span");         // <-- Span, NOT button
      link.textContent = patient.patient_name;
      link.classList.add("patient-link");

      link.addEventListener("click", () => {
        renderPatient(patient);

        // Remove active from all links
        document.querySelectorAll(".patient-link").forEach((el) => {
          el.classList.remove("active");
        });

        link.classList.add("active");
      });

      li.appendChild(link);  // <-- append span
      patientList.appendChild(li);
    });
  },
  error: function (err) {
    console.error("Error loading CSV:", err);
    patientContent.innerHTML =
      "<p>Error loading patient data. Check console.</p>";
  },
});

// Helper to render a single field
function renderField(label, value) {
  if (!value || value.trim() === "") return "";
  return `
    <div class="field">
      <span class="label">${label}</span>
      <span class="value">${value}</span>
    </div>
  `;
}

// Helper to render a section
function renderSection(title, fieldsHTML) {
  if (!fieldsHTML.trim()) return "";
  return `
    <section class="section">
      <h2>${title}</h2>
      ${fieldsHTML}
    </section>
  `;
}

// Render selected patient
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
      <h1 class="patient-name">${patient.patient_name}</h1>
    </header>

    ${renderSection("General Information", general)}
    ${renderSection("Emergency Contact", emergency)}
    ${renderSection("Reason for Visit", visit)}
    ${renderSection("Pre-existing Conditions", conditions)}
  `;
}
