let listaDanych; 
const inputFile = 'data.json';  //przypisanie pliku .json
fetch(inputFile)    //odczytywanie danych z pliku data.json
    .then(response => response.json())
    .then(jsonData => {     //formowaie układu danych
        listaDanych = jsonData.rows.map(row => ({ 
            title: `${row.person}`,
            replaced_by: `${row.replaced_by}`,
            start: row.leave_start,
            allDay: true,
            leave_type: row.leave_type,
            // mozna stworzyc liste z opisanymi typani rodzaju zwolnien odpowiadającej indexami leave_type - 1
            description: `<br>od ${row.leave_start} <br>do ${row.leave_end}`,
        }));
        init();
    })
    .catch(error => console.error('Error fetching JSON:', error));

const init = () => {
    const glownyKalendarz = document.querySelector('#glowny-kalendarz');    //pobranie glównego kontenera
    const dialog = $('#dialog').dialog({  // Use jQuery to initialize the dialog
        autoOpen: false,  // Set to false initially
    });
    const kalendarz = new FullCalendar.Calendar(glownyKalendarz, {  //tworzenie kalendarzu na stronie
        locale: 'pl',   // ustawienie języka wyświetlanych danych na polski
        initialView: 'dayGridMonth',    //defaultowy widok
        headerToolbar: {
            start: 'tytul',
            center: 'title',
            end: 'today multiMonthYear,dayGridMonth,listWeek prevYear,prev,next,nextYear',
            eventDisplay: 'display'
        },
        events: function (fetchInfo, successCallback, failureCallback) {
            if (listaDanych) {
                successCallback(listaDanych);
            } else {
                failureCallback(new Error('Data not available.'));
            }
        },
        dayMaxEventRows: 3,     //ilosc urlopow wyswietlanych w 1 dniu - widok: miesiac
        eventLimitClick: 'popover',
        firstDay: 1,    // rozpoczecie tygodnia od poniedzialku, nie niedzieli (0, default)
        eventClick: function(info){
            dialog.dialog('open');  //otwarcie dailogu
            dialog.dialog('option', 'title', info.event.title); //nadanie nowego tytulu
            dialog.html(info.event.extendedProps.replaced_by+info.event.extendedProps.description); //stworzenie opisu
        },
        customButtons: {
            tytul: {
                text: 'title', //zmienic na current miesiac
                click: function(miesiac) {
                    kalendarz.getOption('customButtons')['tytul'].text = miesiac;
                    if (!isNaN(miesiac) && miesiac >= 1 && miesiac <= 12) {
                        kalendarz.gotoDate(`${miesiac}-01`);
                        console.log(`${miesiac}-01`);
                    } else {
                        window.alert("Niepoprawne dane");
                    }
                }
            }
        }
    });
    kalendarz.render();
    const dataPicker = document.querySelector('#wybor-daty-data');
    dataPicker.onchange = () => {   
        if(dataPicker.value !== null){
            kalendarz.getOption('customButtons')['tytul'].click(dataPicker.value);
            console.log("wyslanie danych do custombutton: ", dataPicker.value);
        }
    }
};
document.addEventListener('DOMContentLoaded', init);
