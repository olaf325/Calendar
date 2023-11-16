const rodzajZwolnieniaKolor = ["red","orange","yellow","lime","green","aqua","blue","purple","pink"];
const rodzajZwolnienia = ["czerwony", "pomarańczowy", "zolty", "lime", "zielony", "aqua", "niebieski", "fioletowy", "rozowy"];
const listaDanych = [
];
const legenda = document.querySelector('#rodzaj-zwolnienia-legenda');
rodzajZwolnienia.forEach(element=> legenda.innerHTML += '<li>- ${element}</li>');
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
        events: getEventsFrom2DArray(testEvents),
    });
    kalendarz.render(); //wypisanie
};
document.addEventListener('DOMContentLoaded', init); 
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
