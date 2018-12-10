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
            React.createElement("img", { src: "/assets/img/date.png", alt: "date", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Date: ",
                dates.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "dateCal" },
                " Calories Total: ",
                dates.calories,
                " "
            ),
            React.createElement(
                "h3",
                { className: "dateSugar " + dates.name + "s" },
                " Sugar Total: ",
                dates.sugar,
                " "
            ),
            React.createElement(
                "h3",
                { className: "sateFat " + dates.name + "f" },
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
        for (var x = 0; x < data.dates.length; x++) {
            if (!data.dates[x].fat) {
                var temp = document.getElementsByClassName(data.dates[x].name + 'f');
                console.log(temp);
                for (var y = 0; y < temp.length; y++) {
                    temp[y].innerHTML = '';
                }
            }
            if (!data.dates[x].sugar) {
                var temp = document.getElementsByClassName(data.dates[x].name + 's');
                console.log(temp);
                for (var y = 0; y < temp.length; y++) {
                    temp[y].innerHTML = '';
                }
            }
        }
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

var ExForm = function ExForm(props) {
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
            React.createElement('input', { id: 'domoAge', type: 'hidden', name: 'age', placeholder: 'Calorie Count' }),
            React.createElement('input', { id: 'sugarCount', type: 'hidden', name: 'sugar', placeholder: 'amount of sugar' }),
            React.createElement('input', { id: 'fatCount', type: 'hidden', name: 'fat', placeholder: 'amount of fat' }),
            React.createElement(
                'select',
                { id: 'exerciseType', name: 'exerciseType', size: '1' },
                React.createElement(
                    'option',
                    { value: 'running' },
                    'Running'
                ),
                React.createElement(
                    'option',
                    { value: 'walking' },
                    'Walking'
                ),
                React.createElement(
                    'option',
                    { value: 'biking' },
                    'Biking'
                ),
                React.createElement(
                    'option',
                    { value: 'swiming' },
                    'Swimming'
                )
            ),
            React.createElement('input', { id: 'exerciseTime', type: 'number', name: 'exerciseTime', placeholder: 'Exercise Duration' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Enter Exercise' })
        ),
        React.createElement(
            'button',
            { id: 'enablePremium', onClick: togglePremium },
            'Get Premium'
        )
    );
};

var ExList = function ExList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Exercises Yet'
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
                { className: 'domoAge' },
                ' Sugar: ',
                domo.sugar,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
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

var exSetup = function exSetup(csrf) {
    console.log("Setting up Exercise2");
    if (document.querySelector("#enterEx")) {
        ReactDOM.render(React.createElement(ExForm, { csrf: csrf }), document.querySelector("#enterEx"));

        ReactDOM.render(React.createElement(ExList, { domos: [] }), document.querySelector("#exercise"));

        //loadDomosFromServer();
    }
};

var exGetToken = function exGetToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        exSetup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up Exercise");
    exGetToken();
    sendAjax('GET', '/getPremium', null, function (data) {
        premium = data.premium;
    });
});
'use strict';

var ExGraphTitle = function ExGraphTitle() {
    return React.createElement(
        'h1',
        { id: 'daysTitle' },
        ' Exercicse Graphs '
    );
};

var dates;

var loadExGraphFromServer = function loadExGraphFromServer() {
    console.log('getting graph data');
    sendAjax('GET', '/getDays', null, function (data) {
        console.log('got graph data');
        console.log(data.dates);
        dates = data.dates;
        console.log('making graphs');

        console.log(dates);
        var exData = {
            x: [],
            y: [],
            name: 'Calories Burned',
            type: 'bar'
        };

        var calLay = { width: 750, height: 300, title: 'Daily Calories Burned Graph' };

        for (var x = 0; x < dates.length; x++) {
            exData.x.push(dates[x].name);

            exData.y.push(dates[x].calories);
        }

        console.log(exData);

        Plotly.plot('exGraph', [exData], calLay);
    });
};

var exGraphSetup = function exGraphSetup(csrf) {
    console.log('loading ex graph data');

    if (document.querySelector("#exGraphTitle")) {
        ReactDOM.render(React.createElement(ExGraphTitle, null), document.querySelector("#exGraphTitle"));

        loadExGraphFromServer();
    }
};

var premium;

var getExGraphToken = function getExGraphToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        exGraphSetup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up dates");
    getExGraphToken();
});
'use strict';

var GraphTitle = function GraphTitle() {
    return React.createElement(
        'h1',
        { id: 'daysTitle' },
        ' Graphs '
    );
};

var Graph = function Graph() {
    console.log('making graphs');

    console.log(dates);
    var calData = {
        x: [],
        y: [],
        name: 'Calories'
    };

    var fatData = {
        x: [],
        y: [],
        name: 'Grams of Fat'
    };

    var sugarData = {
        x: [],
        y: [],
        name: 'Grams of Sugar'
    };

    for (var x = 0; x < dates.length; x++) {
        sugarData.x.push(dates[x].name);
        calData.x.push(dates[x].name);
        fatData.x.push(dates[x].name);

        calData.y.push(dates[x].calories);
        sugarData.y.push(dates[x].sugar);
        fatData.y.push(dates[x].fat);
    }

    return React.createElement(
        'div',
        null,
        React.createElement(Plot, { data: calData, layout: { width: 750, height: 300, title: 'Daily Calorie Graph' } }),
        React.createElement(Plot, { data: fatData, layout: { width: 750, height: 300, title: 'Daily Fat Graph' } }),
        React.createElement(Plot, { data: sugarData, layout: { width: 750, height: 300, title: 'Daily Sugar Graph' } })
    );
};

var dates;

var loadGraphFromServer = function loadGraphFromServer() {
    console.log('getting graph data');
    sendAjax('GET', '/getDays', null, function (data) {
        console.log('got graph data');
        console.log(data.dates);
        dates = data.dates;
        console.log('making graphs');

        console.log(dates);
        var calData = {
            x: [],
            y: [],
            name: 'Calories',
            type: 'bar'
        };

        var fatData = {
            x: [],
            y: [],
            name: 'Grams of Fat',
            type: 'bar'
        };

        var sugarData = {
            x: [],
            y: [],
            name: 'Grams of Sugar',
            type: 'bar'
        };

        var calLay = { width: 750, height: 300, title: 'Daily Calorie Graph' };
        var fatLay = { width: 750, height: 300, title: 'Daily Fat Graph' };
        var sugarLay = { width: 750, height: 300, title: 'Daily Sugar Graph' };

        for (var x = 0; x < dates.length; x++) {
            sugarData.x.push(dates[x].name);
            calData.x.push(dates[x].name);
            fatData.x.push(dates[x].name);

            calData.y.push(dates[x].calories);
            sugarData.y.push(dates[x].sugar);
            fatData.y.push(dates[x].fat);
        }

        console.log(calData);

        Plotly.plot('calPlot', [calData], calLay);
        Plotly.plot('sugarPlot', [sugarData], sugarLay);
        Plotly.plot('fatPlot', [fatData], fatLay);
    });
};

var GraphSetup = function GraphSetup(csrf) {
    console.log('loading graph data');

    if (document.querySelector("#graphTitle")) {
        ReactDOM.render(React.createElement(GraphTitle, null), document.querySelector("#graphTitle"));

        loadGraphFromServer();
    }
};

var premium;

var getGraphToken = function getGraphToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        GraphSetup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up dates");
    getGraphToken();
});
'use strict';

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($('#domoName').val() == '' || $("#domoAge").val() == '') {
        handleError("All fields are required");
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
            React.createElement('input', { type: 'hidden', name: 'exerciseType', value: '' }),
            React.createElement('input', { type: 'hidden', name: 'exerciseTime', value: '0' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Enter Meal' })
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
                'No Meals Yet'
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
                ' Calories: ',
                domo.age,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'sugar ' + domo._id + 's' },
                ' Sugar: ',
                domo.sugar,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'fat ' + domo._id + 'f' },
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
        console.log(data.domos);
        for (var x = 0; x < data.domos.length; x++) {
            if (!data.domos[x].fat) {
                var temp = document.getElementsByClassName(data.domos[x]._id.toString() + 'f');
                for (var y = 0; y < temp.length; y++) {
                    temp[y].innerHTML = '';
                }
            }
            if (!data.domos[x].sugar) {
                var temp = document.getElementsByClassName(data.domos[x]._id.toString() + 's');
                for (var y = 0; y < temp.length; y++) {
                    temp[y].innerHTML = '';
                }
            }
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

var PremTitle = function PremTitle() {
    return React.createElement(
        "h1",
        { id: "premTitle" },
        " Get Premium "
    );
};

var PremForm = function PremForm() {
    return React.createElement(
        "div",
        { id: "premDiv" },
        React.createElement(
            "form",
            null,
            React.createElement("input", { id: "name", name: "name", placeholder: "Name on Card" }),
            React.createElement("input", { id: "cardNumber", type: "number", name: "cNum", placeholder: "xxxx-xxxx-xxxx-xxxx" }),
            React.createElement("input", { id: "secNumber", type: "number", name: "sNum", placeholder: "xxx" })
        )
    );
};

var premSetup = function premSetup(csrf) {
    console.log('loading graph data');

    if (document.querySelector("#premTitle")) {
        ReactDOM.render(React.createElement(PremTitle, null), document.querySelector("#premTitle"));
        ReactDOM.render(React.createElement(PremForm, null), document.querySelector("#premForm"));
    }
};

var premium;

var getPremToken = function getPremToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        premSetup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Setting up dates");
    getPremToken();
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
