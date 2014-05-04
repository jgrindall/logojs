
LG.EventDispatcher =  _.extend(  {}, Backbone.Events);
// global event dispatcher


// and a list of events to prevent mistyping
LG.Events = {};
LG.Events.RESIZE				=	"LG::resize";
LG.Events.CLICK_TIDY			=	"LG::clickTidy";
LG.Events.CLICK_UNDO			=	"LG::clickUndo";
LG.Events.CLICK_DELETE			=	"LG::clickDelete";
LG.Events.CLICK_REDO			=	"LG::clickRedo";
LG.Events.CLICK_CLEAR			=	"LG::clickClear";
LG.Events.CLICK_STOP			=	"LG::clickStop";
LG.Events.CLICK_NEW				=	"LG::clickNew";
LG.Events.CAPTURE_IMAGE			=	"LG::captureImage";
LG.Events.DRAW_FINISHED			=	"LG::drawFinished";
LG.Events.COMMAND_FINISHED		=	"LG::commandFinished";
LG.Events.TICK					=	"LG::commandTick";
LG.Events.PREVIEW_FILE			=	"LG::previewFile";
LG.Events.CLICK_DRAW			=   "LG::clickDraw";
LG.Events.CLICK_DRAW_START		=   "LG::clickDrawStart";
LG.Events.BUTTON_VIS_CHANGED	=	"LG::buttonVisChanged";
LG.Events.CLICK_TEXT			=	"LG::clickText";
LG.Events.UNDO_REDO_DONE		=	"LG::undoRedoDone";
LG.Events.CHANGE_FILE			=	"LG::changeFile";
LG.Events.ALERT_OK				=	"LG::alertOk";
LG.Events.ALERT_CANCEL			=	"LG::alertCancel";
LG.Events.ALERT_NO				=	"LG::alertNo";
LG.Events.DINO_CHANGED			=	"LG::dinoChanged";
LG.Events.RESET_CANVAS			=	"LG::resetCanvas";
LG.Events.HIDE_HELP_OVERLAY		=	"LG::hideHelpOverlay";
LG.Events.ALERT_CLOSED			=	"LG::alertClosed";
LG.Events.ERROR_ROW				=	"LG::errorRow";
LG.Events.FORCE_LOGO			=	"LG::forceLogo";

