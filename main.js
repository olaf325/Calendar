let listaDanych; 
const inputFile = 'data.json'; //przypisanie pliku .json
fetch(inputFile) //odczytywanie danych z pliku data.json
    .then(response => response.json())
    .then(jsonData => {
        listaDanych = jsonData.rows.map(row => ({ //formowaie układu danych
            title: `${row.person}`,
            start: row.leave_start,
            end: row.leave_end,
            allDay: false,
            description: `zastępstwo: ${row.replaced_by}`,
            leave_type: row.leave_type
        }));
        console.log("mapa danych: ",listaDanych);
        init();
    })
    .catch(error => console.error('Error fetching JSON:', error));

const rodzajZwolnieniaKolor = ["red","orange","yellow","lime","green","aqua","blue","purple","pink"];
const rodzajZwolnienia = ["czerwony", "pomarańczowy", "zolty", "lime", "zielony", "aqua", "niebieski", "fioletowy", "rozowy"]; // przypisać kazdy z rodzaji zwolnien

const legenda = document.querySelector('#rodzaj-zwolnienia-legenda');
rodzajZwolnienia.forEach((element, index) => { //stworzenie legendy znajdujacej sie po lewej stronie ekranu
    legenda.innerHTML += `<li color='${rodzajZwolnieniaKolor[index]}'> ${element} </li>`;
});
function getEvents(array) {
    return array.map(event => ({
        title: event.title || "Default Title",
        start: event.start || "Default Start",
        end: event.end || "Default End",
        allDay: event.allDay !== undefined ? event.allDay : false,
        description: event.description || "Default Description",
        backgroundColor: rodzajZwolnieniaKolor[(event.leave_type || 1) - 1] || "Default Color"
    }));
}
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
        navLinks: true,
        events: listaDanych
    });
    kalendarz.render();
};
document.addEventListener('DOMContentLoaded', init);
