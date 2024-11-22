// BoatGallery Menu
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
      navLinks.classList.toggle('responsive');
    }
  }

// Reservation Requests
document.addEventListener('DOMContentLoaded', () => {
    loadItems(); 
  
    const chartCanvas = document.getElementById('myReservation');
    if (chartCanvas) {
      displaymyReservation();
    }
  });

// Create or update reservation requests
function createOrUpdateItem() {
    const boatType = document.getElementById('boatType').value;
    const rentalDuration = document.getElementById('rentalDuration').value;
    const editingId = document.getElementById('reservationForm').dataset.editingId;
    const submit = document.getElementById('submit');

    if (boatType && rentalDuration) {
        let items = getItemsFromLocalStorage();
  
        if (editingId) {
            const itemIndex = items.findIndex(i => i.id === parseInt(editingId));
            if (itemIndex !== -1) {
                items[itemIndex].boatType = boatType;
                items[itemIndex].rentalDuration = rentalDuration;
  
                document.getElementById('reservationForm').dataset.editingId = '';
                if (submit) {
                    submit.textContent = 'Submit';
                }
            }
        } else {
            const newItem = {
                id: Date.now(),
                boatType: boatType,
                rentalDuration: rentalDuration
            };
            items.push(newItem);
        }

        saveItemsToLocalStorage(items);
      displayItems();
      document.getElementById('reservationForm').reset(); 
  } else {
      alert('Please enter both the boat type and duration!');
  }
}

function displayItems() {
    const reservationList = document.getElementById('reservationList');
    if (!reservationList) return; 
  
    reservationList.innerHTML = ''; 
    const items = getItemsFromLocalStorage();
  
    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('boat-items');
        li.innerHTML = `
            <h4>${item.boatType}</h4>
            <p>Duration: ${item.rentalDuration}</p>
            <button onclick="editItem(${item.id})">Edit</button>
            <button onclick="deleteItem(${item.id})">Delete</button>
        `;
        reservationList.appendChild(li);
    });
    
  }

  function editItem(id) {
    const items = getItemsFromLocalStorage();
    const item = items.find(i => i.id === id);
    const submitBtn = document.getElementById('submit');
  
    if (item) {
        document.getElementById('boatType').value = item.boatType;
        document.getElementById('rentalDuration').value = item.rentalDuration;
        document.getElementById('reservationForm').dataset.editingId = id;
  
        if (submit) {
            submit.textContent = 'Update Reservation';
        }
    }
  }
  
  document.getElementById('reservationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    createOrUpdateItem();
  });
  
  function deleteItem(id) {
    let items = getItemsFromLocalStorage();
    items = items.filter(item => item.id !== id);
    saveItemsToLocalStorage(items);
    displayItems();
  }
  
  function getItemsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('reservationItems')) || [];
  }
  
  function saveItemsToLocalStorage(items) {
    localStorage.setItem('reservationItems', JSON.stringify(items));
  }
  
  function loadItems() {
    displayItems();
  }

// Analytics
function displaymyReservation() {
    const items = getItemsFromLocalStorage();
  
    if (items.length === 0) {
        alert('No reservations found. Add reservation requests.');
        return;
    }
  
    const itemCounts = {};
    items.forEach(item => {
        if (itemCounts[item.name]) {
            itemCounts[item.name]++;
        } else {
            itemCounts[item.name] = 1;
        }
    });


    const labels = Object.keys(itemCounts);
    const data = Object.values(itemCounts);
  
    const chartCanvas = document.getElementById('myReservation');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Requests',
                    data: data,
                    backgroundColor: 'rgba(0, 94, 255, 0.493)',
                    borderColor: 'rgba(0, 94, 255, 0.493)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Requests'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Boat Types'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    } else {
        console.log('Chart canvas not found.');
    }
  }
