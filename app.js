class TableManager {
  constructor(data, containerId) {
    this.data = data;
    this.containerId = containerId;
  }

  renderTable(headers, sortableFields, nameStyle = '') {
    const container = document.getElementById(this.containerId);
    container.innerHTML = '';

   
    let currentRow;
    this.data.forEach((item, index) => {
      if (index % 2 === 0) {
        currentRow = document.createElement('div');
        currentRow.classList.add('animal-row');
        container.appendChild(currentRow);
      }

      const box = document.createElement('div');
      box.classList.add('animal-box');

      const details = document.createElement('div');
      details.classList.add('animal-details');

      headers.forEach((header) => {
        const key = header.toLowerCase();
        const detail = document.createElement('span');

        if (key === 'image') {
          const img = document.createElement('img');
          img.src = item[key];
          img.alt = item['name'];
          img.classList.add('animal-image');
          box.appendChild(img);
        } else if (key === 'name' && nameStyle) {
          detail.innerHTML = `<span class="${nameStyle}">${item[key]}</span>`;
        } else {
          detail.innerText = `${header}: ${item[key]}`;
        }

        if (key !== 'image') details.appendChild(detail);
      });


      const actions = document.createElement('div');
      actions.innerHTML = `
        <button class="btn btn-sm btn-primary me-2" onclick="editRow(${index}, '${this.containerId}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRow(${index}, '${this.containerId}')">Delete</button>
      `;

      box.appendChild(details);
      box.appendChild(actions);
      currentRow.appendChild(box);
    });
  }

  sortData(field) {
    this.data.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    this.renderTable(Object.keys(this.data[0]), ['name', 'location', 'size']);
  }

  addAnimal(newAnimal) {

    const isDuplicate = this.data.some((animal) => animal.name === newAnimal.name);
    if (isDuplicate) {
      alert('Duplicate animal name!');
      return;
    }
    this.data.push(newAnimal);
    this.renderTable(Object.keys(this.data[0]), ['name', 'location', 'size']);
  }
}

function editRow(index, containerId) {
  const table = tableInstances[containerId];
  const animal = table.data[index];
  const newName = prompt('Edit Name:', animal.name);
  if (newName) {
    animal.name = newName;
    table.renderTable(Object.keys(table.data[0]), ['name', 'location', 'size']);
  }
}

function deleteRow(index, containerId) {
  const table = tableInstances[containerId];
  table.data.splice(index, 1);
  table.renderTable(Object.keys(table.data[0]), ['name', 'location', 'size']);
}


const tableInstances = {};
fetch('animals.json')
  .then((response) => response.json())
  .then((data) => {
    tableInstances['bigCatsTable'] = new TableManager(data.bigCats, 'bigCatsTable');
    tableInstances['bigCatsTable'].renderTable(['Species', 'Name', 'Size', 'Location', 'Image'], ['name', 'size', 'location']);

    tableInstances['dogsTable'] = new TableManager(data.dogs, 'dogsTable');
    tableInstances['dogsTable'].renderTable(['Species', 'Name', 'Size', 'Location', 'Image'], ['name', 'location'], 'fw-bold');

    tableInstances['bigFishTable'] = new TableManager(data.bigFish, 'bigFishTable');
    tableInstances['bigFishTable'].renderTable(['Species', 'Name', 'Size', 'Location', 'Image'], ['size'], 'fw-bold text-primary fst-italic');
  })
  .catch((error) => {
    console.error('Error loading data:', error);
  });
