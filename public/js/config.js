// global config constants

LG.Config = {};

// turn this off to prevent console logging completely
LG.Config.DEBUG = true;

// this variable is replaced by the ant build script
LG.Config.PHONEGAP = false;

LG.Config.IS_TOUCH = LG.Utils.isTouch();

// preload and compile the html using this list - should be faster
LG.Config.TEMPLATES = ["tpl_helpoverlay","tpl_dinobutton","tpl_spinner","tpl_gallerypage","tpl_helpbuttonmenu","tpl_help","tpl_newbutton","tpl_deletebutton","tpl_writetop","tpl_menutop","tpl_writebutton","tpl_settingsbutton","tpl_cancelbutton","tpl_menubuttons","tpl_menu","tpl_loadrow","tpl_load","tpl_gallerylist","tpl_gallerybottom","tpl_gallerytop","tpl_galleryleftbutton","tpl_galleryrightbutton","tpl_loadbutton","tpl_galleryrow","tpl_gallery","tpl_filename","tpl_alert","tpl_savebutton","tpl_helpbutton","tpl_tidybutton","tpl_clearbutton","tpl_gallerybutton", "tpl_logobutton", "tpl_loginbutton","tpl_filebutton","tpl_textbutton","tpl_undobutton","tpl_redobutton","tpl_startbutton","tpl_pausebutton","tpl_stopbutton","tpl_header","tpl_write","tpl_writebuttons","tpl_canvas","tpl_activitybuttons","tpl_activity"];

LG.Config.PRODUCT_ID = "logojs";

LG.Config.WANT_TO_SAVE = "Do you want to save your current file?";
LG.Config.WANT_TO_DELETE = "Are you sure you want to delete this file?";
