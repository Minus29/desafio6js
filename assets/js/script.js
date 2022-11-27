const monedaSelect = document.querySelector('#monedas');
const botonCalcular = document.querySelector('#button');

//obtener datos actuales
async function obtenerDatosActual() {
    const res = await fetch('https://mindicador.cl/api/');
    const data = await res.json();
    return data;
}

//obtener datos historicos
async function obtenerDatosHistoricos(moneda, fecha) {
    const res = await fetch(`https://mindicador.cl/api/${moneda}/${fecha}`);
    const data = await res.json();

    return data;
}
//construyendo la seleccion de la moneda
async function construyeSelect() {
    const data = await obtenerDatosActual();
    const monedas = (Object.keys(data));
    let html = "";
    for (const codigo_moneda of monedas) {
        const moneda = data[codigo_moneda];
        if (moneda.unidad_medida == 'Pesos') {
            html += `<option value="${moneda.codigo}-${moneda.valor}" class="option">${moneda.nombre}</option>`;
        };

    };
    monedaSelect.innerHTML = html;

};

//funcion para convertir la moneda
botonCalcular.addEventListener('click', async function () {
    const pesosChilenos = document.querySelector('#pesosChilenos').value;
    tasaConverserion = document.querySelector('#monedas').value.split('-');
    const resultado = pesosChilenos / tasaConverserion[1];

    document.querySelector('#resultado').innerHTML = resultado.toFixed(2);
    const codigoMoneda = tasaConverserion[0];
    const fechaActual = new Date();


    let fechas = [];
    let valores = [];
    let ultimoValor = 0;
    for (i = 10; i > 0; i--) {
        const dia = fechaActual.getDate() - i;
        const mes = fechaActual.getMonth() + 1;
        const año = fechaActual.getFullYear();

        const fechaConsulta = `${dia}-${mes}-${año} `;
        const dataHistorica = await obtenerDatosHistoricos(codigoMoneda,fechaConsulta);

        fechas.push(fechaConsulta);
        if (dataHistorica.serie.length > 0) {
            valores.push(dataHistorica.serie[0].valor);
            ultimoValor = dataHistorica.serie[0].valor;
        } else {
            valores.push(ultimoValor);
        }
    }

    dibujaGrafico(fechas,valores);
});

construyeSelect();

function dibujaGrafico(fechas, valores) {
    const ctx = document.getElementById('myChart');
    const data = {
        labels: fechas,
        datasets: [{
            label: 'historico',
            data: valores,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    new Chart(ctx, {
        type: 'line',
        data: data,
    });
}



