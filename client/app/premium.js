const PremTitle = () => {
    return (
        <h1 id="premTitle"> Get Premium </h1>
    )
}

const PremForm = function() {
    return(
        <div id="premDiv">
            <form>
                <input id="name" name="name" placeholder="Name on Card"/>
                <input id="cardNumber" type="number" name="cNum" placeholder="xxxx-xxxx-xxxx-xxxx"/>
                <input id="secNumber" type="number" name="sNum" placeholder="xxx" />
            </form>
        </div>
    );
};

const premSetup = function(csrf) {
    console.log('loading graph data');
    
    if(document.querySelector("#premTitle")){
        ReactDOM.render(
            <PremTitle />, document.querySelector("#premTitle")
        );
        ReactDOM.render(
            <PremForm />, document.querySelector("#premForm")
        );
    }
};

var premium;

const getPremToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        premSetup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Setting up dates");
    getPremToken();
});