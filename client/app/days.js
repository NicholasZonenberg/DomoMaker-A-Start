const DayTitle = (props) => {
    return (
        <h1 id="daysTitle"> Total Per Day </h1>
    )
}

const DayList = function(props) {
    console.log(props);
    if(props.dates.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Dates Yet</h3>
            </div>
        );
    }

    const domoNodes = props.dates.map(function(dates) {
        console.log(dates);
        return(
            <div key={dates._id} className="domo">
                <img src="/assets/img/date.png" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Date: {dates.name} </h3>
                <h3 className="domoAge"> Claroies Total: {dates.calories} </h3>
                <h3 className="sugar"> Sugar Total: {dates.sugar} </h3>
                <h3 className="fat"> Fat Total: {dates.fat} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDaysFromServer = () => {
    sendAjax('GET', '/getDays', null, (data) => {
        console.log(data);
        ReactDOM.render(
            <DayList dates={data.dates} />, document.querySelector("#daysList")
        );
    });
};

const daySetup = function(csrf) {
    console.log("Setting up Domos");
    if(document.querySelector("#dayTitle")){
        ReactDOM.render(
            <DayTitle />, document.querySelector("#dayTitle")
        );

        ReactDOM.render(
            <DayList dates={[]} />, document.querySelector("#daysList")
        );

        loadDaysFromServer();
    }
};

const getDayToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        daySetup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Setting up dates");
    getDayToken();
});