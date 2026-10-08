let contacts = JSON.parse(localStorage.getItem('contactHubList')) || [];
let modalInstance = null;

const contactsContainer = document.getElementById('contactsContainer');
const favoritesList = document.getElementById('favoritesList');
const emergencyList = document.getElementById('emergencyList');
const searchInput = document.getElementById('searchInput');

const totalCount = document.getElementById('totalCount');
const favCount = document.getElementById('favCount');
const emergencyCount = document.getElementById('emergencyCount');
const contactsSubtitle = document.getElementById('contactsSubtitle');

const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]{2,30}$/;
const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

document.addEventListener('DOMContentLoaded', () => {
  modalInstance = new bootstrap.Modal(document.getElementById('contactModal'));
  renderApp();
});

function renderApp(filteredList = contacts) {
  displayContacts(filteredList);
  displaySidebarFavorites();
  displaySidebarEmergency();
  updateCounters();
}

function displayContacts(list) {
  contactsContainer.innerHTML = '';

  if (list.length === 0) {
    contactsContainer.innerHTML = `
      <div class="col-12 d-flex flex-column align-items-center justify-content-center py-5">
          <div class="text-muted mb-3 opacity-25">
              <i class="fa-regular fa-address-book" style="font-size: 60px;"></i>
          </div>
          <h6 class="fw-bold text-secondary mb-1">No contacts found</h6>
          <p class="text-muted small">Click "Add Contact" to get started</p>
      </div>
    `;
    return;
  }

  list.forEach((contact) => {
    const originalIndex = contacts.indexOf(contact);

    const cardHTML = `
      <div class="col-12 col-sm-6">
        <div class="card border-0 rounded-16 p-3 shadow-sm bg-white h-100">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="d-flex align-items-center gap-2">
              <div class="bg-light text-purple rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style="width: 42px; height: 42px;">
                ${contact.name.charAt(0).toUpperCase()}
              </div>
              <div class="text-truncate">
                <h6 class="fw-bold mb-0 text-dark text-truncate">${contact.name}</h6>
                <small class="text-secondary" style="font-size: 12px;">${contact.phone}</small>
              </div>
            </div>
            <div class="d-flex gap-1 flex-shrink-0">
              <button class="btn btn-sm ${contact.isFavorite ? 'text-warning' : 'text-muted'} border-0 btn-circle-action" onclick="toggleFavorite(${originalIndex})">
                <i class="fa-solid fa-star"></i>
              </button>
              <button class="btn btn-sm ${contact.isEmergency ? 'text-danger' : 'text-muted'} border-0 btn-circle-action" onclick="toggleEmergency(${originalIndex})">
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>

          <p class="text-muted small mb-3 text-truncate"><i class="fa-regular fa-envelope me-1"></i>${contact.email}</p>

          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <div class="d-flex gap-2">
              <a href="tel:${contact.phone}" class="btn btn-sm btn-light rounded-circle text-success btn-circle-action" title="Call">
                <i class="fa-solid fa-phone"></i>
              </a>
              <a href="mailto:${contact.email}" class="btn btn-sm btn-light rounded-circle text-info btn-circle-action" title="Email">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-link text-secondary p-0 me-2" onclick="openUpdateModal(${originalIndex})">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-sm btn-link text-danger p-0" onclick="deleteContact(${originalIndex})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    contactsContainer.innerHTML += cardHTML;
  });
}

function displaySidebarFavorites() {
  const favs = contacts.filter((c) => c.isFavorite);
  favoritesList.innerHTML = '';

  if (favs.length === 0) {
    favoritesList.innerHTML = `<p class="text-center text-muted small my-3 opacity-75">No favorites yet</p>`;
    return;
  }

  favs.forEach((contact) => {
    favoritesList.innerHTML += `
      <div class="d-flex justify-content-between align-items-center p-2 rounded-12 bg-light sidebar-item">
        <div class="d-flex align-items-center gap-2 text-truncate me-2">
          <i class="fa-solid fa-star text-warning small flex-shrink-0"></i>
          <div class="text-truncate">
            <p class="mb-0 fw-semibold text-dark small text-truncate">${contact.name}</p>
            <small class="text-muted" style="font-size: 10px;">${contact.phone}</small>
          </div>
        </div>
        <a href="tel:${contact.phone}" class="btn btn-sm btn-white text-success shadow-sm btn-circle-action flex-shrink-0">
          <i class="fa-solid fa-phone small"></i>
        </a>
      </div>
    `;
  });
}

function displaySidebarEmergency() {
  const ems = contacts.filter((c) => c.isEmergency);
  emergencyList.innerHTML = '';

  if (ems.length === 0) {
    emergencyList.innerHTML = `<p class="text-center text-muted small my-3 opacity-75">No emergency contacts</p>`;
    return;
  }

  ems.forEach((contact) => {
    emergencyList.innerHTML += `
      <div class="d-flex justify-content-between align-items-center p-2 rounded-12 bg-light sidebar-item">
        <div class="d-flex align-items-center gap-2 text-truncate me-2">
          <i class="fa-solid fa-heart text-danger small flex-shrink-0"></i>
          <div class="text-truncate">
            <p class="mb-0 fw-semibold text-dark small text-truncate">${contact.name}</p>
            <small class="text-muted" style="font-size: 10px;">${contact.phone}</small>
          </div>
        </div>
        <a href="tel:${contact.phone}" class="btn btn-sm btn-white text-danger shadow-sm btn-circle-action flex-shrink-0">
          <i class="fa-solid fa-phone small"></i>
        </a>
      </div>
    `;
  });
}

function updateCounters() {
  totalCount.innerText = contacts.length;
  favCount.innerText = contacts.filter((c) => c.isFavorite).length;
  emergencyCount.innerText = contacts.filter((c) => c.isEmergency).length;
  contactsSubtitle.innerText = `Manage and organize your ${contacts.length} contacts`;
}

function openAddModal() {
  document.getElementById('modalTitle').innerText = 'Add New Contact';
  document.getElementById('contactIndex').value = '';
  document.getElementById('contactForm').reset();
  clearValidation();
  modalInstance.show();
}

function openUpdateModal(index) {
  document.getElementById('modalTitle').innerText = 'Edit Contact';
  document.getElementById('contactIndex').value = index;

  document.getElementById('contactName').value = contacts[index].name;
  document.getElementById('contactPhone').value = contacts[index].phone;
  document.getElementById('contactEmail').value = contacts[index].email;
  document.getElementById('isFavorite').checked = contacts[index].isFavorite;
  document.getElementById('isEmergency').checked = contacts[index].isEmergency;

  clearValidation();
  modalInstance.show();
}

function saveContact() {
  const index = document.getElementById('contactIndex').value;
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const isFavorite = document.getElementById('isFavorite').checked;
  const isEmergency = document.getElementById('isEmergency').checked;

  const isNameValid = validateField(document.getElementById('contactName'), nameRegex, name);
  const isPhoneValid = validateField(document.getElementById('contactPhone'), phoneRegex, phone);
  const isEmailValid = validateField(document.getElementById('contactEmail'), emailRegex, email);

  if (!isNameValid || !isPhoneValid || !isEmailValid) return;

  if (index === '') {
    contacts.push({ name, phone, email, isFavorite, isEmergency });
    Swal.fire({ icon: 'success', title: 'Added successfully!', timer: 1500, showConfirmButton: false });
  } else {
    contacts[index] = { name, phone, email, isFavorite, isEmergency };
    Swal.fire({ icon: 'success', title: 'Updated successfully!', timer: 1500, showConfirmButton: false });
  }

  saveToStorage();
  modalInstance.hide();
  renderApp();
}

function deleteContact(index) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      saveToStorage();
      renderApp();
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false });
    }
  });
}

function toggleFavorite(index) {
  contacts[index].isFavorite = !contacts[index].isFavorite;
  saveToStorage();
  renderApp();
}

function toggleEmergency(index) {
  contacts[index].isEmergency = !contacts[index].isEmergency;
  saveToStorage();
  renderApp();
}

function searchContacts() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
  );
  renderApp(filtered);
}

function validateField(element, regex, value) {
  if (regex.test(value)) {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
    return true;
  } else {
    element.classList.remove('is-valid');
    element.classList.add('is-invalid');
    return false;
  }
}

function clearValidation() {
  ['contactName', 'contactPhone', 'contactEmail'].forEach((id) => {
    const el = document.getElementById(id);
    el.classList.remove('is-valid', 'is-invalid');
  });
}

function saveToStorage() {
  localStorage.setItem('contactHubList', JSON.stringify(contacts));
}