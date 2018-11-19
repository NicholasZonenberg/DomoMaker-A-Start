"use strict";

var DayTitle = function DayTitle(props) {
    return React.createElement(
        "h1",
        { id: "daysTitle" },
        " Total Per Day "
    );
};

var DayList = function DayList(props) {
    console.log(props);
    if (props.dates.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Dates Yet"
            )
        );
    }

    var domoNodes = props.dates.map(function (dates) {
        console.log(dates);
        return React.createElement(
            "div",
            { key: dates._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/date.png", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Date: ",
                dates.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                " Claroies Total: ",
                dates.calories,
                " "
            ),
            React.createElement(
                "h3",
                { className: "sugar" },
                " Sugar Total: ",
                dates.sugar,
                " "
            ),
            React.createElement(
                "h3",
                { className: "fat" },
                " Fat Total: ",
                dates.fat,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDaysFromServer = function loadDaysFromServer() {
    sendAjax('GET', '/getDays', null, function (data) {
        console.log(data);
        ReactDOM.render(React.createElement(DayList, { dates: data.dates }), document.querySelector("#daysList"));
    });
};

var daySetup = function daySetup(csrf) {
    console.log("Setting up Domos");
    if (document.querySelector("#dayTitle")) {
        ReactDOM.render(React.createElement(DayTitle, null), document.querySelector("#dayTitle"));

        ReactDOM.render(React.createElement(DayList, { dates: [] }), document.querySelector("#daysList"));

        loadDaysFromServer();
    }
};

var getDayToken = function getDayToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        daySetup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up dates");
    getDayToken();
});
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

var premium = false;

var DomoForm = function DomoForm(props) {
    function togglePremium(e) {
        console.log("toggeling premium");
        sendAjax('GET', '/premium', null, function (data) {
            premium = data.premium;
        });
        if (premium) {
            document.getElementById("sugarCount").disabled = true;
            document.getElementById("fatCount").disabled = true;
        } else {
            document.getElementById("sugarCount").disabled = false;
            document.getElementById("fatCount").disabled = false;
        }
    }

    return React.createElement(
        'div',
        null,
        React.createElement(
            'form',
            { id: 'domoForm', onSubmit: handleDomo, name: 'domoForm', action: '/maker', method: 'POST', className: 'domoForm' },
            React.createElement('input', { id: 'domoName', type: 'date', name: 'name', placeholder: 'Date of meal' }),
            React.createElement('input', { id: 'domoAge', type: 'number', name: 'age', placeholder: 'Calorie Count' }),
            React.createElement('input', { id: 'sugarCount', type: 'number', name: 'sugar', placeholder: 'amount of sugar' }),
            React.createElement('input', { id: 'fatCount', type: 'number', name: 'fat', placeholder: 'amount of fat' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
        ),
        React.createElement(
            'button',
            { id: 'enablePremium', onClick: togglePremium },
            'Get Premium'
        )
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
            React.createElement('img', { src: '/assets/img/meal.jpg', alt: 'domo face', className: 'domoFace' }),
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
        console.log;
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
        if (!premium) {
            document.getElementById("sugarCount").disabled = true;
            document.getElementById("fatCount").disabled = true;
        } else {
            document.getElementById("sugarCount").disabled = false;
            document.getElementById("fatCount").disabled = false;
        }
    });
};

var setup = function setup(csrf) {
    console.log("Setting up Domos");
    if (document.querySelector("#makeDomo")) {
        ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

        ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

        loadDomosFromServer();
    }
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up Domos");
    getToken();
    sendAjax('GET', '/getPremium', null, function (data) {
        premium = data.premium;
    });
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
