const ExGraphTitle = () => {
    return (
        <h1 id="daysTitle"> Exercicse Graphs </h1>
    )
}

var dates;

const loadExGraphFromServer = () => {
    console.log('getting graph data');
    sendAjax('GET', '/getDays', null, (data) => {
        console.log('got graph data');
        console.log(data.dates);
        dates=data.dates;
        console.log('making graphs');

        console.log(dates);
        var exData={
            x:[],
            y:[],
            name:'Calories Burned',
            type:'bar'
        };

        var calLay = {width: 750, height: 300, title: 'Daily Calories Burned Graph'};

        for(var x = 0; x < dates.length; x++){
            exData.x.push(dates[x].name);

            exData.y.push(dates[x].calories);
        }

        console.log(exData);

        Plotly.plot('exGraph',[exData],calLay);
    });
};

const exGraphSetup = function(csrf) {
    console.log('loading ex graph data');
    
    if(document.querySelector("#exGraphTitle")){
        ReactDOM.render(
            <ExGraphTitle />, document.querySelector("#exGraphTitle")
        );

        loadExGraphFromServer();
    }
};

var premium;

const getExGraphToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        exGraphSetup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Setting up dates");
    getExGraphToken();
});