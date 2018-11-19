const GraphTitle = () => {
    return (
        <h1 id="daysTitle"> Graphs </h1>
    )
}

const Graph = function() {
    console.log('making graphs');

    console.log(dates);
    var calData={
        x:[],
        y:[],
        name:'Calories'
    };

    var fatData={
        x:[],
        y:[],
        name:'Grams of Fat'
    }

    var sugarData={
        x:[],
        y:[],
        name:'Grams of Sugar'
    }

    for(var x = 0; x < dates.length; x++){
        sugarData.x.push(dates[x].name);
        calData.x.push(dates[x].name);
        fatData.x.push(dates[x].name);

        calData.y.push(dates[x].calories);
        sugarData.y.push(dates[x].sugar);
        fatData.y.push(dates[x].fat);
    }

    return(
        <div>
            <Plot data={calData} layout={{width: 750, height: 300, title: 'Daily Calorie Graph'}} />
            <Plot data={fatData} layout={{width: 750, height: 300, title: 'Daily Fat Graph'}} />
            <Plot data={sugarData} layout={{width: 750, height: 300, title: 'Daily Sugar Graph'}} />
        </div>
    );
};

var dates;

const loadGraphFromServer = () => {
    console.log('getting graph data');
    sendAjax('GET', '/getDays', null, (data) => {
        console.log('got graph data');
        console.log(data.dates);
        dates=data.dates;
        console.log('making graphs');

        console.log(dates);
        var calData={
            x:[],
            y:[],
            name:'Calories',
            type:'bar'
        };

        var fatData={
            x:[],
            y:[],
            name:'Grams of Fat',
            type:'bar'
        }

        var sugarData={
            x:[],
            y:[],
            name:'Grams of Sugar',
            type:'bar'
        }

        var calLay = {width: 750, height: 300, title: 'Daily Calorie Graph'};
        var fatLay = {width: 750, height: 300, title: 'Daily Fat Graph'};
        var sugarLay = {width: 750, height: 300, title: 'Daily Sugar Graph'};

        for(var x = 0; x < dates.length; x++){
            sugarData.x.push(dates[x].name);
            calData.x.push(dates[x].name);
            fatData.x.push(dates[x].name);

            calData.y.push(dates[x].calories);
            sugarData.y.push(dates[x].sugar);
            fatData.y.push(dates[x].fat);
        }

        console.log(calData);

        Plotly.plot('calPlot',[calData],calLay);
        Plotly.plot('sugarPlot',[sugarData],sugarLay);
        Plotly.plot('fatPlot',[fatData],fatLay);
    });
};

const GraphSetup = function(csrf) {
    console.log('loading graph data');
    
    if(document.querySelector("#graphTitle")){
        ReactDOM.render(
            <GraphTitle />, document.querySelector("#graphTitle")
        );

        loadGraphFromServer();
    }
};

var premium;

const getGraphToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        GraphSetup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Setting up dates");
    getGraphToken();
});