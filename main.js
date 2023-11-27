/*  
zeby kalendarz sie załadował potrzebny jest aktywny serwer, inaczej pojawią się errory w konsoli, jest to wynikiem pobierania danych z pliku json
    node.js command prompt
    1.    npm install -g http-server
    2.    http-server
*/
let listaDanych; 
const urlopKolory = ['#CC444B', '#501537', '#824C71', '#D4E79E', '#9FBBCC', '#DCCCA3', '#0F4C5C', '#846C5B', '#C4B2BC', '#4E937A', '#B4656F'];
const urlopLista = ["urlop wypoczynkowy", "typ2", "typ3", "typ4", "typ5", "typ6", "typ7", "typ8", "typ9", "typ10", "typ11"];
let infromacjeFlaga = true;

const inputFile = 'data.json';  //przypisanie pliku .json
fetch(inputFile)    //odczytywanie danych z pliku data.json
    .then(response => response.json())
    .then(jsonData => {     //formowaie układu danych
        listaDanych = jsonData.rows.map(row => ({ 
            title: `${row.person}, zastepujący: ${row.replaced_by}`,
            replaced_by: `${row.replaced_by}`,
            start: moment(row.leave_start).format('YYYY-MM-DD'),
            allDay: false,
            leave_type: row.leave_type,
            color: `${urlopKolory[row.leave_type - 1]}`,
            description: `${urlopLista[row.leave_type - 1]} od ${moment(row.leave_start).format('YYYY-MM-DD')} do ${moment(row.leave_end).format('YYYY-MM-DD')}`, //sformatowanie danych w opisie dialogu
        }));
        init();
    })
    .catch(error => console.error('Error fetching JSON:', error));

const init = () => {
    const glownyKalendarz = document.querySelector('#glowny-kalendarz');    //pobranie glównego kontenera
    const dialog = $('#dialog').dialog({  // uzycie jQuery zeby zainicjowac dialog
        autoOpen: false,  // ustawia na false, zeby dialog nie otwierał sie przed otworzeniem eventu
    });
    const dialogInfo = $('#dialog-info').dialog({ 
        autoOpen: false,  
    });
    const kalendarz = new FullCalendar.Calendar(glownyKalendarz, {  //tworzenie kalendarzu na stronie
        locale: 'pl',   // ustawienie języka wyświetlanych danych na polski
        initialView: 'dayGridMonth',    //defaultowy widok
        firstDay: 1,    // rozpoczecie tygodnia od poniedzialku, nie niedzieli (0, default)
        dayMaxEventRows: 3,     //ilosc urlopow wyswietlanych w 1 dniu - widok: miesiac
        headerToolbar: {
            start: 'rok,miesiac,lista wyborMiesiaca',
            end: 'dzisiaj prevYear,prev,next,nextYear',
            eventDisplay: 'display'
        },
        customButtons: {
            dzisiaj: {
                text: 'dzisiaj',
                click: function (){
                    kalendarz.today();
                }
            },
            rok: {
                text: 'rok',
                click: function (){
                    kalendarz.changeView('multiMonthYear');
                }
            },
            miesiac: {
                text: 'miesiac',
                click: function (){
                    kalendarz.changeView('dayGridMonth');
                }
            },
            lista: {
                text: 'lista',
                click: function (){
                    kalendarz.changeView('listWeek');
                }
            },
            wyborMiesiaca: {
              text: moment(new Date()).format("YYYY-MM"),
              click: function() { 
                const dataPickerInput = document.querySelector('#wybor-daty-data'); // pobranie wartosci z inputa
                    // trzeba kliknac enter po wybraniu daty
                // dataPickerInput.oninput = () =>{
                //     document.addEventListener('keydown', function (event) {
                //         const klawisz = event.key;
                //         if(dataPickerInput.value.length !== 0 && klawisz =='Enter'){ //sprawdzenie czy nie jest pusty
                //             const data = new Date(`${dataPickerInput.value}-01`); //stworzenie daty, do ktorej ma przeniesc sie kalendarz
                //             kalendarz.gotoDate(data); //przeniesie do danej daty
                //         } 
                //     });
                // }  
                    // bez klikania enter - wpisywanie daty recznie powoduje ciagłe renderowanie kalendarza przed wpisaniem roku, w wyniku nie da sie wpisac 2023 - zostaje zamienione na 1902, 0, 1902, 1903
                dataPickerInput.onchange = () => {
                    if(dataPickerInput.ariaValueMax.length > 0){
                        const data = new Date(`${dataPickerInput.value}-01`); //stworzenie daty, do ktorej ma przeniesc sie kalendarz
                        kalendarz.gotoDate(data); //przeniesie do danej daty
                    }
                }
              }
            }
        },
        events: function (fetchInfo, successCallback, failureCallback) {
            if (listaDanych) {
                successCallback(listaDanych);
            } else {
                failureCallback(new Error('Data not available.'));
            }
            
        },
        eventClick: function(info){
            dialog.dialog('close'); //zamkniecie jakichkolwiek wcześniej otwartych dialogów
            dialog.dialog('open');  //otwarcie dailogu
            dialog.dialog({
                title: info.event.title,
                width: 600,
                position: { my: 'left top', at: 'right bottom'} //ułożenie dialogu w miejscu kursora               
            });
            dialog.html(info.event.extendedProps.description); //stworzenie opisu
        },
        displayEventTime: false,
        initialDate: moment(new Date()).format("YYYY-MM-DD"),   //ustawienie początkowego roku
    });
    kalendarz.render();
    const zmianaDatyInput = () => {
        $('#wybor-daty-data').val(moment(kalendarz.getDate().toISOString()).format("YYYY-MM"));
    };
    kalendarz.setOption('datesSet', (info) => {
        zmianaDatyInput();        
    });
    kalendarz.getOption('customButtons')['wyborMiesiaca'].click(); 
    const informacje = document.querySelector('#informacje');
    informacje.onclick = (e) => { 
        if(infromacjeFlaga == true){ //blokowanie ciągłego dodawania tych samych danych do dialogu, ponowne kliknięcie obrazka spowoduje, że dialog sie zamknie
            dialogInfo.dialog({
                title: "informacje",
                position: { my: 'left top' + 5, at: 'right bottom' + 5, of: e } //ułożenie dialogu w miejscu kursora
            });
            dialogInfo.dialog('open');
            urlopLista.forEach((element, index) => {
                dialogInfo.html(dialogInfo.html() + `<span style='color:${urlopKolory[index]}'> ● </span><span>${element}</span><br>`); //tworzenie listy w oknie
            });
            infromacjeFlaga = false;
        } else {
            dialogInfo.html('');
            dialogInfo.dialog('close');
            infromacjeFlaga = true;
        }
    }

    document.addEventListener('keydown', function (event) {
        const klawisz = event.key;
        if (klawisz === '/') {
            // po kliknięciu '/' przenosi do inputa
            event.preventDefault();
            document.querySelector('#wybor-daty-data').focus();
        }
    });
};
