const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($('#domoName').val() == '' || $("#domoAge").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

var premium = false;

const DomoForm = (props) => {
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
                <input id="domoAge" type="number" name="age" placeholder="Calorie Count"/>
                <input id="sugarCount" type="number" name="sugar" placeholder="amount of sugar" />
                <input id="fatCount" type="number" name="fat" placeholder="amount of fat" />
                <input type="hidden" name="exerciseType" value="" />
                <input type="hidden" name="exerciseTime" value="0" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Enter Meal" />
            </form>
            <button id="enablePremium" onClick={togglePremium}>Get Premium</button>
        </div>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Meals Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/meal.jpg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Date: {domo.name} </h3>
                <h3 className="domoAge"> Calories: {domo.age} </h3>
                <h3 className={`sugar ${domo._id}s`}> Sugar: {domo.sugar} </h3>
                <h3 className={`fat ${domo._id}f`}> Fat: {domo.fat} </h3>
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
        console.log(data.domos);
        for(var x = 0; x < data.domos.length; x++){
            if (!data.domos[x].fat){
                var temp = document.getElementsByClassName(data.domos[x]._id.toString()+'f');
                for(var y = 0; y < temp.length; y++){
                    temp[y].innerHTML='';
                }
            }
            if (!data.domos[x].sugar){
                var temp = document.getElementsByClassName(data.domos[x]._id.toString()+'s');
                for(var y = 0; y < temp.length; y++){
                    temp[y].innerHTML='';
                }
            } 
        }
    });
};

const setup = function(csrf) {
    console.log("Setting up Domos");
    if(document.querySelector("#makeDomo")){
        ReactDOM.render(
            <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
        );

        ReactDOM.render(
            <DomoList domos={[]} />, document.querySelector("#domos")
        );

        loadDomosFromServer();
    }
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Setting up Domos");
    getToken();
    sendAjax('GET', '/getPremium', null, (data) => {
        premium=data.premium;
    })
});