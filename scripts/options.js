const stateSelect = document.getElementById('state-field');

function createOptionsElements(elem, value, text, className, parentElem) {
    elem.value = value;
    
    if(className) {
        elem.classList.add(className);
    }
    elem.innerText = text;
    parentElem.appendChild(elem);
}

// fill states list
$.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome', 
    states => {

        for(let state of states) {
            let option = document.createElement('option');

            createOptionsElements(option, state.id, state.nome, 
                'state-option', stateSelect);
        }
    })

stateSelect.addEventListener('change', checkCities);

const citySelect = document.getElementById('city-field');

function checkCities() {

    const UF = this.value;

    if(citySelect.disabled === true) {
        
        citySelect.disabled = false;
        fillCityList(UF);

    } else {

        clearCityField();
        fillCityList(UF);
    }
}

function clearCityField() {
    $('#city-field').empty();

    let disabledOption = document.createElement('option');
    disabledOption.selected = true;
    disabledOption.disabled = true;
    createOptionsElements(disabledOption, '', 
        'Selecione sua cidade', null, citySelect);
}

function fillCityList(UF) {
    
    $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`, 
        cities => {
        
            for(let city of cities) {
                let option = document.createElement('option');
                citySelect.appendChild(option);

                createOptionsElements(option, city.id, 
                    city.nome, 'city-option', citySelect);
            }
        })
}
