const PremTitle = () => {
    return (
        <h1 id="premTitle"> Get Premium </h1>
    )
}



const handlePrem = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if(($('#name').val() == '' || $("#cardNumber").val() == '' || $("#secNumber").val() == '' ||
    $("#expDate").val() == ''|| $("#bName").val() == '' || $("#email").val() == ''|| $("#address").val() == ''||
    $("#city").val() == ''|| $("#state").val() == ''|| $("#zip").val() == '') && !premium ){
        handleError("All fields are required");
        return false;
    }

    sendAjax('GET', '/premium', null, (data) => {
        sendAjax('GET', '/getPremium', null, (data) => {
            premium=data.premium;
            if(premium){
                document.getElementById("name").disabled = true;
                document.getElementById("cardNumber").disabled = true;
                document.getElementById("secNumber").disabled = true;
                document.getElementById("expDate").disabled = true;
                document.getElementById("bName").disabled = true;
                document.getElementById("email").disabled = true;
                document.getElementById("address").disabled = true;
                document.getElementById("city").disabled = true;
                document.getElementById("state").disabled = true;
                document.getElementById("zip").disabled = true;
                document.getElementById("prembutton").value = 'Remove Premium';
            }
            else {
                document.getElementById("name").disabled = false;
                document.getElementById("cardNumber").disabled = false;
                document.getElementById("secNumber").disabled = false;
                document.getElementById("expDate").disabled = false;
                document.getElementById("bName").disabled = false;
                document.getElementById("email").disabled = false;
                document.getElementById("address").disabled = false;
                document.getElementById("city").disabled = false;
                document.getElementById("state").disabled = false;
                document.getElementById("zip").disabled = false;
                document.getElementById("prembutton").value = 'Get Premium';
            }
        })
    })

    return false;
};

var premium = false;

const PremForm = function(props) {
    return(
        <div id="premDiv">
            <h3 className='premTitle'> Card Info </h3>
            <form id="premForm" onSubmit={handlePrem} name="premForm" action="/premium" method="POST">
                <input id="name" name="name" placeholder="Name on Card" className='premIn'/>
                <input id="cardNumber" type="number" name="cNum" placeholder="xxxx-xxxx-xxxx-xxxx" className='premIn'/>
                <input id="secNumber" type="number" name="sNum" placeholder="xxx" className='premIn' />
                <input id="expDate" type="date" name="expDate" />
                <h3 className='premTitle'> Billing Info </h3>
                <input id='bName' name='bName' placeholder='Jhon Doe' className='premIn' />
                <input id='email' name='email' placeholder='jhon@example.com' className='premIn' />
                <input id='address' name='adress' placeholder='5 Street Street' className='premIn' />
                <input id='city' name='city' placeholder='City' className='premIn' />
                <input id='state' name='state' placeholder='NY' className='premIn' />
                <input id='zip' name='zip' placeholder='xxxxx' className='premIn'/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input id='prembutton' className="makeDomoSubmit" type="submit" value="Get Premium" />
            </form>
        </div>
    );
};

const premSetup = function(csrf) {
    
    if(document.querySelector("#premTitle")){
        ReactDOM.render(
            <PremTitle />, document.querySelector("#premTitle")
        );
        ReactDOM.render(
            <PremForm csrf={csrf} />, document.querySelector("#premForm")
        );
    }

    sendAjax('GET', '/getPremium', null, (data) => {
        premium=data.premium;
    })

    if(premium){
        document.getElementById("name").disabled = true;
        document.getElementById("cardNumber").disabled = true;
        document.getElementById("secNumber").disabled = true;
        document.getElementById("expDate").disabled = true;
        document.getElementById("bName").disabled = true;
        document.getElementById("email").disabled = true;
        document.getElementById("address").disabled = true;
        document.getElementById("city").disabled = true;
        document.getElementById("state").disabled = true;
        document.getElementById("zip").disabled = true;
        document.getElementById("prembutton").value = 'Remove Premium';
    }
    else {
        document.getElementById("name").disabled = false;
        document.getElementById("cardNumber").disabled = false;
        document.getElementById("secNumber").disabled = false;
        document.getElementById("expDate").disabled = false;
        document.getElementById("bName").disabled = false;
        document.getElementById("email").disabled = false;
        document.getElementById("address").disabled = false;
        document.getElementById("city").disabled = false;
        document.getElementById("state").disabled = false;
        document.getElementById("zip").disabled = false;
        document.getElementById("prembutton").value = 'Get Premium';
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