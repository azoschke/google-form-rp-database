// CSV export URLs
const patientsURL = "https://docs.google.com/spreadsheets/d/1lCdnYH1rMBAG9mh_9ncNZeFwMvJJebRk8K7f1BRHhxQ/export?format=csv&gid=0";
const visitsURL = "https://docs.google.com/spreadsheets/d/1FhxF4wHA3rUudwqN1ewn7c3xDJfnkbI0BZ-Sc83bPVY/export?format=csv&gid=0";

const patientList = document.getElementById("patientList");
const patientContent = document.getElementById("patientContent");

let patientsData = [];
let visitsData = [];

// Load patients
Papa.parse(patientsURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    patientsData = results.data;
    buildPatientSidebar();
  },
  error: function(err) {
    console.error("Error loading patients CSV:", err);
  }
});

// Load visits
Papa.parse(visitsURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    visitsData = results.data;
  },
  error: function(err) {
    console.error("Error loading visits CSV:", err);
  }
});

// Build sidebar
function buildPatientSidebar() {
  patientsData.forEach(patient => {
    if (!patient.patient_id || !patient.patient_name) return;
    const li = document.createElement("li");
    const link = document.createElement("span");

    link.textContent = patient.patient_name;
    link.classList.add("patient-link");
    link.dataset.patientId = patient.patient_id;

    link.addEventListener("click", () => {
      document.querySelectorAll(".patient-link").forEach(el => el.classList.remove("active"));
      link.classList.add("active");
      renderPatient(patient.patient_id);
    });

    li.appendChild(link);
    patientList.appendChild(li);
  });
}

// Render a patient by ID
function renderPatient(patientId) {
  const patient = patientsData.find(p => p.patient_id === patientId);
  if (!patient) return;

  const general = `
    ${renderField("Race",  patient.race)}
    ${renderField("Gender", patient.gender)}
    ${renderField("Age", patient.age)}
    ${renderField("Date Updated", patient.date_updated)}
  `;

  const emergency = `
    ${renderField("Name", patient.emergency_contact_name)}
    ${renderField("Relationship", patient.emergency_contact_relationship)}
    ${renderField("Contact Method", patient.emergency_contact_method)}
  `;

  const conditions = `
    ${renderField("Chronic Illness", patient.chronic_illness)}
    ${renderField("Previous Injuries", patient.previous_injuries)}
    ${renderField("Known Allergies", patient.known_allergies)}
    ${renderField("Current Medications", patient.current_medications)}
    ${renderField("Aetheric Abnormalities", patient.aetheric_abnormalities)}
  `;

  // Find visits for this patient
  const patientVisits = visitsData.filter(v => v.patient_id === patientId);

  // Build visit list
  let visitLinks = "";
  if (patientVisits.length) {
    patientVisits.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date)); // latest first
    patientVisits.forEach(v => {
      visitLinks += `<li><span class="visit-link" data-visit-id="${v.visit_id}">${v.visit_date}</span></li>`;
    });
  }

  patientContent.innerHTML = `
    <header class="patient-header">
      <h1 class="patient-name">${patient.patient_name}</h1>
    </header>

    ${renderSection("General Information", general)}
    ${renderSection("Emergency Contact", emergency)}
    ${renderSection("Pre-existing Conditions", conditions)}

    <section class="section visits-section">
      <h2>Visits</h2>
      <ul class="visit-list">${visitLinks}</ul>
      <div id="visitDetails"></div>
    </section>
  `;

  // Attach click handlers for visit links
  document.querySelectorAll(".visit-link").forEach(link => {
    link.addEventListener("click", () => {
      const visitId = link.dataset.visitId;
      const visit = patientVisits.find(v => v.visit_id === visitId);
      showVisitDetails(visit);
    });
  });
}

function showVisitDetails(visit) {
  if (!visit) return;
  const details = `
    ${renderField("Presenting Complaint", visit.presenting_complaint)}
    ${renderField("Current Symptoms", visit.current_symptoms)}
    ${renderField("Recent Exposures", visit.recent_exposures)}
  `;
  document.getElementById("visitDetails").innerHTML = `
    <section class="section visit-details">
      ${details}
    </section>
  `;
}

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
