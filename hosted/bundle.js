'use strict';

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($('#domoName').val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        'form',
        { id: 'domoForm', onSubmit: handleDomo, name: 'domoForm', action: '/maker', method: 'POST', className: 'domoForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Date: '
        ),
        React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Date of meal' }),
        React.createElement(
            'label',
            { htmlFor: 'age' },
            'Calories: '
        ),
        React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Calorie Count' }),
        React.createElement(
            'label',
            { htmlFor: 'sugar' },
            'Grams of Sugar: '
        ),
        React.createElement('input', { id: 'sugarCount', type: 'text', name: 'sugar', placeholder: 'amount of sugar' }),
        React.createElement(
            'label',
            { htmlFor: 'fat' },
            'Grams of Fat: '
        ),
        React.createElement('input', { id: 'fatCount', type: 'text', name: 'fat', placeholder: 'amount of fat' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Domos Yet'
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            'div',
            { key: domo._id, className: 'domo' },
            React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                ' Date: ',
                domo.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
                ' Claroies: ',
                domo.age,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'sugar' },
                ' Sugar: ',
                domo.sugar,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'fat' },
                ' Fat: ',
                domo.fat,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'domoList' },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    console.log("Setting up Domos");
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up Domos");
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = xhr.responseText;
            handleError(messageObj.error);
        }
    });
};
