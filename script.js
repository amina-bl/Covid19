const ctx = document.getElementById('myChart').getContext('2d');
let list=document.querySelector('#side ul');
let req=new XMLHttpRequest();
req.open("GET","https://api.covid19api.com/countries",true);
req.onreadystatechange=function(){
    console.log(req.readyState)
    if(req.readyState==4 && req.status==200){
        let resp=JSON.parse(req.responseText);
        resp.forEach(e => {
            let li=document.createElement('li');
            li.setAttribute('id',e.ISO2);
            li.innerHTML=e.Country;
            li.addEventListener('click',itemClick);
            list.appendChild(li)
        });
    }
}
req.send();
function itemClick(e){
    let code='MA'
    if(e)
        code=e.target.getAttribute('id');
    let httpreq=new XMLHttpRequest();
    httpreq.open("GET","https://api.covid19api.com/dayone/country/"+code,true);
    httpreq.onreadystatechange=function(){
        if(httpreq.readyState==4 && httpreq.status==200){
            let row=JSON.parse(httpreq.response);
            chartUpdate(myChart,row);
        }
    }
    httpreq.send()
}
itemClick(null);

function chartUpdate(myChart,row){
    let labels=row.map(e=>{
        let date=new Date(e.Date);
        day=date.getDate();
        month=date.getMonth()+1;
        return `${day}/${month}`;
        
    });
    
    let confirmed=row.map(e=>e.Confirmed);
    let recovered=row.map(e=>e.Recovered);
    let active=row.map(e=>e.Active);
    let deaths=row.map(e=>e.Deaths);
    
    let datasets=[
        {
            label:'Confirmed',
            data:confirmed,
            borderColor:"orange"
        },
        {
            label:'Recovered',
            data:recovered,
            borderColor:"green"
        },{
            label:'Active',
            data:active,
            borderColor:"blue"
        },{
            label:'Deaths',
            data:deaths,
            borderColor:"red"
        }
    ]
    myChart.data.datasets=datasets;
    myChart.data.labels=labels;
    // console.log(row[0].Country)
    myChart.options.plugins.title.text=row[0].Country
    myChart.update()
    console.log(myChart.options.plugins.title.text)
}



const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            // label: '# of Votes',
            data: [],
           
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Maroc',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
    ,
    scales: {
        y: {
            beginAtZero: true
        }
    }
    }
});

