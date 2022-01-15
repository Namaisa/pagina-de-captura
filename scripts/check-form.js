document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.needs-validation')
        .addEventListener('submit', checkFields);
})

function checkFields(e) {

    e.preventDefault();

    const nameField = $('#name-field');

    if(!nameField.val().match(/\w/))
        nameField.val('');
    
    const form = e.target;

    if(!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
    } else {
        getFormData(nameField, form);
    }
}

class Data {
    constructor(name, email, state, city) {
        this.name = name;
        this.email = email;
        this.state = state;
        this.city = city;
    }
}

let formData = null;

function getFormData(nameField, form) {

    /* 
        In this case only the name and email is used, 
        but I created an object with the city and state to 
        simulate the storage case in a database 
    */

    // select the state and city by the code
    const stateCode = stateSelect.value,
        cityCode = citySelect.value;

    $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}`, 
        state => {

            $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cityCode}`, 
                city => {

                    let emailField = $('#email-field');

                    formData = new Data(
                        nameField.val(), 
                        emailField.val(), 
                        state.nome, 
                        city.nome);
                    
                    form.classList.remove('was-validated');
                    clearFormFields([nameField, emailField]);
                    
                    createPopup();
                })
        })
}

function clearFormFields(inputFields) {
    inputFields.forEach(f => f.val(''));
    stateSelect.value = '';
    clearCityField();
}

function createPopup() {

    const M = 'modal';

    let popupContainer = document.createElement('div');
    popupContainer.classList.add(M);
    popupContainer.classList.add('fade');
    popupContainer.id = 'formPopup';
    popupContainer.tabIndex = '-1';
    popupContainer.setAttribute('aria-labelledby', 'formPopupLabel');
    popupContainer.ariaHidden = true;
    
    let popup = document.createElement('div');
    let popupClasses = ['', '-centered', '-fullscreen-md-down'];
    popupClasses.forEach(c => popup.classList.add('modal-dialog' + c));
    popupContainer.append(popup);

    let popupContent = document.createElement('div');
    popupContent.classList.add(M + '-content');
    popup.appendChild(popupContent);

    let popupHeader = document.createElement('div');
    popupHeader.classList.add(M + '-header');
    popupContent.appendChild(popupHeader);

    let h4 = document.createElement('h4');
    h4.classList.add(M + '-title')
    h4.textContent = 'Obrigado por se inscrever!';
    popupHeader.appendChild(h4);

    let button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn-close');
    button.dataset.bsDismiss = 'modal';
    button.ariaLabel = 'Close';
    popupHeader.appendChild(button);

    let body = document.createElement('div');
    body.classList.add(M + '-body');
    popupContent.appendChild(body);

    let p = document.createElement('p');
    p.textContent = 
        `${formData.name} você se inscreveu com sucesso em nosso workshop! Em breve o convite chegará no email ${formData.email}.`;
    body.appendChild(p);

    let modal = new bootstrap.Modal(popupContainer);
    modal.toggle();
}