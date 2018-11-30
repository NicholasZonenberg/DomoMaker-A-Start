const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($('#domoName').val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

var premium = false;

const ExForm = (props) => {
    function togglePremium(e){
        console.log("toggeling premium");
        sendAjax('GET', '/premium', null, (data) => {
            premium=data.premium;
        })
        if(premium){
            document.getElementById("sugarCount").disabled = true;
            document.getElementById("fatCount").disabled = true;
        }
        else {
            document.getElementById("sugarCount").disabled = false;
            document.getElementById("fatCount").disabled = false;
        }
    }
    
    return (
        <div>
            <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
                <input id="domoName" type="date" name="name" placeholder="Date of meal"/>
                <input id="domoAge" type="hidden" name="age" placeholder="Calorie Count"/>
                <input id="sugarCount" type="hidden" name="sugar" placeholder="amount of sugar" />
                <input id="fatCount" type="hidden" name="fat" placeholder="amount of fat" />
                <select id="exerciseType" name="exerciseType" size="1" >
                    <option value="running">Running</option>
                    <option value="walking">Walking</option>
                    <option value="biking">Biking</option>
                    <option value="swiming">Swimming</option>
                </select>
                <input id="exerciseTime" type="number" name="exerciseTime" placeholder="Exercise Duration" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Make Domo" />
            </form>
            <button id="enablePremium" onClick={togglePremium}>Get Premium</button>
        </div>
    );
};

const ExList = function(props) {
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/meal.jpg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Date: {domo.name} </h3>
                <h3 className="domoAge"> Claroies: {domo.age} </h3>
                <h3 className="domoAge"> Sugar: {domo.sugar} </h3>
                <h3 className="domoAge"> Fat: {domo.fat} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        console.log
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
        if(!premium){
            document.getElementById("sugarCount").disabled = true;
            document.getElementById("fatCount").disabled = true;
        }
        else {
            document.getElementById("sugarCount").disabled = false;
            document.getElementById("fatCount").disabled = false;
        }
    });
};

const exSetup = function(csrf) {
    console.log("Setting up Exercise2");
    if(document.querySelector("#enterEx")){
        ReactDOM.render(
            <ExForm csrf={csrf} />, document.querySelector("#enterEx")
        );

        ReactDOM.render(
            <ExList domos={[]} />, document.querySelector("#exercise")
        );

        //loadDomosFromServer();
    }
};

const exGetToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        exSetup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Setting up Exercise");
    exGetToken();
    sendAjax('GET', '/getPremium', null, (data) => {
        premium=data.premium;
    })
});