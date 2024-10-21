// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import Alert from 'bootstrap/js/dist/alert';

// or, specify which plugins you need:
import { Tooltip, Toast, Popover } from 'bootstrap';

import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { DateTime } from "luxon";
// import {Tabulator, FormatModule, EditModule} from 'tabulator-tables';
// Tabulator.registerModule([FormatModule, EditModule]);

//define some sample data
var tabledata = [
    {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
    {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
    {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
    {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
    {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
];

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
    dependencies:{
        DateTime:DateTime,
    },  
    height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"Name", field:"name", width:150},
        {title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
        {title:"Favourite Color", field:"col"},
        {title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
        {title:"Example", field:"example", editor:"input", editorParams:{
            search:true,
            mask:"AAA-999",
            selectContents:true,
            elementAttributes:{
                maxlength:"10", //set the maximum character length of the input element to 10 characters
            },
        }},
    ],
});

//trigger an alert message when the row is clicked
table.on("rowClick", function(e, row){ 
   alert("Row " + row.getData().id + " Clicked!!!!");
});
table.on("cellEdited", function(cell){
    alert("Row " + cell.getData().id + " Edited!!!!");
    table.deleteRow(cell.getData().id); //delete row with an id of 15
});