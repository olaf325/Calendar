const rodzajZwolnieniaKolor = ["red","orange","yellow","lime","green","aqua","blue","purple","pink"];
const rodzajZwolnienia = [];
const listaDanych = 
    [
		{
			"leave_start": "2022-12-29 00:00:00",
			"leave_end": "2023-01-02 00:00:00",
			"leave_type": 1,
			"person": "Tomkowiak Paulina",
			"replaced_by": "Malcher Jola"
		},
		{
			"leave_start": "2023-01-02 00:00:00",
			"leave_end": "2023-01-02 00:00:00",
			"leave_type": 1,
			"person": "Tobor Hanna",
			"replaced_by": "Wypych Eliza"
		}
    ];
function getEventsFrom2DArray(array) {
    return array.map(row => ({
      title: row[3],  
      start: row[0],
      end: row[1],
      allDay: false,  
      description: `Replaced by: ${row[4]}`,
      backgroundColor: rodzajZwolnieniaKolor[event.leave_type - 1]
    }));
}
const testEvents = [
    {
      title: "Test Event",
      start: "2023-11-01 12:00:00",
      end: "2023-11-01 14:00:00",
      allDay: false,
      description: "Test Description",
      backgroundColor: "red",
    },
];
console.log(testEvents);
const init = () => {
    let rodzajKalendarza = 0; //jezeli rowny 0 kalendarz 1 miesiaca, inaczej cały rok
    const glownyKalendarz = document.querySelector('#glowny-kalendarz');  //pobranie glównego kontenera
    const kalendarz = new FullCalendar.Calendar(glownyKalendarz, {
        locale: 'pl',
        initialView: 'dayGridMonth',
        headerToolbar: {    //ułożenie danych w nagłówku
            start: 'prev today next',
            center: 'title',
            end: 'prevYear,nextYear',
            eventDisplay: 'display'
        },
        // customButtons: {  // DOESNT FUCKING WORK no validator shows errors so that must be the librarys fault AND THE FUNNY THING IS TAHT THIS LBRARY IS BROKEN i think i should start looking for a new one
        //     monthsList: { 
        //       text: 'miesiąc',
        //       click: function() { //zmiana rodzaju wyswietlanego kalendarza
        //         if (rodzajKalendarza == 0) {
        //             rodzajKalendarza++;
        //             kalendarz.setOption('initialView', rodzajKalendarza === 0 ? 'dayGridMonth' : 'multiMonthYear'); //jezeli rodzaj kalendarza jest równy 0, wartosc initialView zostaje zamieniona na dayGrid, w przeciwnym wypadku ustawiane jest multiMonthYear
        //             console.log("rok");
        //             kalendarz.render(); 
        //         } else {
        //             rodzajKalendarza--;
        //             kalendarz.setOption('initialView', rodzajKalendarza === 0 ? 'dayGridMonth' : 'multiMonthYear');
        //             console.log("miesiac");
        //             kalendarz.render(); 
        //         }
        //       }
        //     }
        // },
        events: getEventsFrom2DArray(testEvents),
    });
    kalendarz.render(); //wypisanie
};
document.addEventListener('DOMContentLoaded', init); 
// flatpickr('#picker', { ciagle errory, like wdym error w linii 953
//         altInput: true,
//         dateFormat: "YYYY-MM-DD",
//         altFormat: "DD-MM-YYYY",
//         allowInput: true,
//         parseDate: (datestr, format) => {
//           return moment(datestr, format, true).toDate();
//         },
//         formatDate: (date, format, locale) => {
//           // locale can also be used
//           return moment(date).format(format);
//         }
// });
const miesiaceInit = () => {
    const miesiace = document.querySelector('#miesiace');
    const kalendarz = new FullCalendar.Calendar(miesiace, {
        locale: 'pl',
        initialView: 'multiMonthYear',
        headerToolbar: {
            start: 'prev',
            center: 'title',
            end: 'next'
        }
    });
    kalendarz.render();
};
document.addEventListener('DOMContentLoaded', miesiaceInit); 