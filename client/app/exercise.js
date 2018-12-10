const handleEx = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($('#domoName').val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#exForm").attr("action"), $("#exForm").serialize(), function() {
        loadExDatFromServer();
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
            <form id="exForm" onSubmit={handleEx} name="domoForm" action="/maker" method="POST" className="domoForm">
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
                <input className="exSubmit" type="submit" value="Enter Exercise" />
            </form>
        </div>
    );
};

const Empt = function(){
    return(
        <div className="domoList">
            <h3 className="emptyDomo">No Exercises Yet</h3>
        </div>
    );
}

const ExList = function(props) {
    console.log('props');
    console.log(props);
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Exercises Yet</h3>
            </div>
        );
    }

    const exNodes = props.domos.map(function(exDat) {
        return(
            <div key={exDat._id} className={`domo ${exDat._id}`} >
                <img src="/assets/img/meal.jpg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Date: {exDat.name} </h3>
                <h3 className="exType"> Exercise Type: {exDat.exerciseType} </h3>
                <h3 className="domoAge"> Length: {exDat.exerciseTime} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {exNodes}
        </div>
    );
};

const loadExDatFromServer = () => {
    sendAjax('GET', '/getDomos', null, (exDat) => {
        console.log('exDat:')
        console.log(exDat);
        ReactDOM.render(
            <ExList domos={exDat.domos} />, document.querySelector("#exercise")
        );
        console.log('render done');
        if(!premium){
            document.getElementById("domoName").disabled = true;
            document.getElementById("exerciseType").disabled = true;
            document.getElementById("exerciseTime").disabled = true;
        }
        else {
            document.getElementById("domoName").disabled = false;
            document.getElementById("exerciseType").disabled = false;
            document.getElementById("exerciseTime").disabled = false;
        }

        var anyEx = 0;
        var anyTest = 0;

        for(var x = 0; x < exDat.domos.length; x++){
            console.log('x');
            if(!exDat.domos[x].exerciseType){
                var temp = document.getElementsByClassName(exDat.domos[x]._id.toString());
                temp[0].innerHTML='';
                temp[0].classList='';
                anyEx++;
            }
            anyTest++;
        }

        console.log(anyEx + ' ' + anyTest);

        if (anyEx === anyTest){
            ReactDOM.render(
                <Empt />, document.querySelector("#exercise")
            );
        }
    });
};

const exSetup = function(csrf) {
    console.log("Setting up Exercise2");
    if(document.querySelector("#enterEx")){
        ReactDOM.render(
            <ExForm csrf={csrf} />, document.querySelector("#enterEx")
        );

        loadExDatFromServer();

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