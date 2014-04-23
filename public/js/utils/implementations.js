
if (!Array.prototype.indexOf) {

	Array.prototype.indexOf = function(obj) {
		var i, j = this.length;
		for (i = 0; i < j; i++) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	};
}




if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        };
    })();
}