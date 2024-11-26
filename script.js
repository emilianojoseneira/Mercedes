let numeros = [];

function agregarNumero() {
    const input = document.getElementById('numero');
    const numero = parseFloat(input.value);
    
    if (!isNaN(numero)) {
        numeros.push(numero);
        actualizarLista();
        input.value = '';
    } else {
        alert('Por favor ingrese un número válido');
    }
}

function actualizarLista() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    numeros.forEach(numero => {
        const li = document.createElement('li');
        li.textContent = numero;
        lista.appendChild(li);
    });
}

function calcular() {
    if (numeros.length === 0) {
        alert('Por favor agregue números a la lista');
        return;
    }

    const suma = numeros.reduce((a, b) => a + b, 0);
    const promedio = suma / numeros.length;
    const maximo = Math.max(...numeros);
    const minimo = Math.min(...numeros);

    document.getElementById('suma').textContent = suma;
    document.getElementById('promedio').textContent = promedio.toFixed(2);
    document.getElementById('maximo').textContent = maximo;
    document.getElementById('minimo').textContent = minimo;
}

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const multiplier = document.getElementById('multiplierInput').value;

    if (!file) {
        document.getElementById('uploadMessage').textContent = 'Por favor seleccione un archivo';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('multiplier', multiplier);

    fetch('upload.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('uploadMessage').textContent = data;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('uploadMessage').textContent = 'Error al subir el archivo';
    });
}

function buscarCodigoMBA() {
    const codigoMBA = document.getElementById('codigoMBAInput').value;

    fetch(`search.php?codigo_mba=${codigoMBA}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const results = data.result;
                const resultTableBody = document.getElementById('resultTableBody');
                resultTableBody.innerHTML = ''; // Clear previous results

                results.forEach(result => {
                    const us = parseFloat(result['U$S']);
                    const bonf = parseFloat(result['Bonf']);
                    const calculatedValue = us - (us * (bonf / 100));
                    const multiplier = parseFloat(document.getElementById('multiplierInput').value) || 1;
                    const multipliedValue = calculatedValue * multiplier;
                    const additionalMultiplier = 1; // Default value for additional multiplier
                    const finalValue = multipliedValue * additionalMultiplier;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${result['Est']}</td>
                        <td>${result['Código']}</td>
                        <td>${result['Codigo_MBA']}</td>
                        <td>${result['Descripción']}</td>
                        <td>${result['U$S']}</td>
                        <td><input type="number" value="${result['Bonf']}" oninput="updateCalculatedValue(this, ${us}, this.parentElement.nextElementSibling, this.parentElement.nextElementSibling.nextElementSibling, this.parentElement.nextElementSibling.nextElementSibling.nextElementSibling)"></td>
                        <td>${calculatedValue.toFixed(2)}</td>
                        <td>${multipliedValue.toFixed(2)}</td>
                        <td><input type="number" value="${additionalMultiplier}" oninput="updateFinalValue(this, this.parentElement.previousElementSibling)"></td> <!-- New column input -->
                        <td>${finalValue.toFixed(2)}</td> <!-- New column value -->
                    `;
                    resultTableBody.appendChild(row);
                });

                document.getElementById('resultForm').style.display = 'block';
            } else {
                document.getElementById('searchResult').textContent = 'No se encontró el Código MBA';
                document.getElementById('resultForm').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('searchResult').textContent = 'Error al buscar el Código MBA';
            document.getElementById('resultForm').style.display = 'none';
        });
}

function updateCalculatedValue(input, us, resultCell, multipliedCell, finalCell) {
    const bonf = parseFloat(input.value);
    const calculatedValue = us - (us * (bonf / 100));
    resultCell.textContent = calculatedValue.toFixed(2);

    const multiplier = parseFloat(document.getElementById('multiplierInput').value) || 1;
    const multipliedValue = calculatedValue * multiplier;
    multipliedCell.textContent = multipliedValue.toFixed(2);

    const additionalMultiplier = parseFloat(multipliedCell.nextElementSibling.firstElementChild.value) || 1;
    const finalValue = multipliedValue * additionalMultiplier;
    finalCell.textContent = finalValue.toFixed(2);
}

function updateFinalValue(input, multipliedCell) {
    const multipliedValue = parseFloat(multipliedCell.textContent);
    const additionalMultiplier = parseFloat(input.value) || 1;
    const finalValue = multipliedValue * additionalMultiplier;
    input.parentElement.nextElementSibling.textContent = finalValue.toFixed(2);

    // Store the additional multiplier value
    fetch('store_additional_multiplier.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ additionalMultiplier })
    });
}

function updateAllCalculatedValues() {
    const multiplier = parseFloat(document.getElementById('multiplierInput').value) || 1;
    const rows = document.querySelectorAll('#resultTableBody tr');

    rows.forEach(row => {
        const calculatedCell = row.children[6];
        const multipliedCell = row.children[7];
        const additionalMultiplierInput = row.children[8].firstElementChild;
        const finalCell = row.children[9];

        const calculatedValue = parseFloat(calculatedCell.textContent);
        const multipliedValue = calculatedValue * multiplier;
        multipliedCell.textContent = multipliedValue.toFixed(2);

        const additionalMultiplier = parseFloat(additionalMultiplierInput.value) || 1;
        const finalValue = multipliedValue * additionalMultiplier;
        finalCell.textContent = finalValue.toFixed(2);
    });
}