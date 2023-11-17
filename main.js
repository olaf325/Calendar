let listaDanych; 
const inputFile = 'data.json'; //przypisanie pliku .json
fetch(inputFile) //odczytywanie danych z pliku data.json
    .then(response => response.json())
    .then(jsonData => { //formowaie układu danych
        listaDanych = jsonData.rows.map(row => ({ 
            title: `${row.person}`,
            start: row.leave_start,
            allDay: true,
            description: `zastępstwo: ${row.replaced_by}`,
            leave_type: row.leave_type
        }));
        init();
    })
    .catch(error => console.error('Error fetching JSON:', error));

const rodzajZwolnieniaKolor = ["red","orange","yellow","lime","green","aqua","blue","purple","pink"];
const rodzajZwolnienia = ["czerwony", "pomarańczowy", "zolty", "lime", "zielony", "aqua", "niebieski", "fioletowy", "rozowy"]; // przypisać kazdy z rodzaji zwolnien
const init = () => {
    const glownyKalendarz = document.querySelector('#glowny-kalendarz');  //pobranie glównego kontenera
    const kalendarz = new FullCalendar.Calendar(glownyKalendarz, { //tworzenie kalendarzu na stronie
        locale: 'pl',
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'prev today next',
            center: 'title',
            end: 'multiMonthYear,dayGridMonth,listWeek prevYear,nextYear',
            eventDisplay: 'display'
        },
        eventLimit: true,
        firstDay: 1,
        events: listaDanych,
        eventRender: function (info) { const leaveType = info.event.extendedProps.leave_type;
            const leaveTypeIndex = leaveType - 1; // leave_type zaczyna sie od 1, dane w tabeli od 0
            info.el.style.backgroundColor = rodzajZwolnieniaKolor[leaveTypeIndex];
        },
        dateClick: function (info) {
            zmianaDaty(kalendarz, info.date);
            console.log(info.date);
        }
    });
    kalendarz.render();
    const wyborDaty = document.querySelector('#wybor-daty');
    wyborDaty.onclick = () => {
        const miesiac = parseInt(document.querySelector('#wybor-daty-data').value); 
        if (!isNaN(miesiac) && miesiac >= 1 && miesiac <= 12) {
            zmianaDaty(kalendarz.gotoDate(new Date(new Date().getFullYear(), miesiac - 1, 1)));
        } else {
            window.alert("Niepoprawne dane");
        }
    };
    const zmianaDaty = (calendar, newDate) => {
        calendar.gotoDate(newDate);
        calendar.setOption('events', listaDanych);
    };
};
document.addEventListener('DOMContentLoaded', init);
