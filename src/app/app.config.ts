//Enum variable for tab 
export var EN_TAB_PAGES = {
    EN_TP_HOME: 0,
    EN_TP_PLANET:1,
    EN_TP_STAR: 2,
    EN_TP_LENGTH: 3,
    }
    //A global variable 
    export var Globals = {
    //Nav ctrl of each tab page
    navCtrls : new Array(EN_TAB_PAGES.EN_TP_LENGTH),
    tabIndex:0, //Index of the current tab
    tabs: <any>{}, //Hook to the tab object
    }