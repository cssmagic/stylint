'use strict';

var isLineBadRe = /^{|[,}]|(:after|:active|:before|@import|@require|@extend|@media|:hover|@font-face|src)|,$/;

// check that selector properties are sorted alphabetically
module.exports = function duplicates( line ) {
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t]/), line );
	var isThereADupe = false;

	// if root check not global, obliterate cache on each new file
	if ( !this.config.globalDupe && this.cache.prevFile !== this.cache.file ) {
		this.cache.sCache = {};
	}

	// if cache for curr context doesn't exist yet (or was obliterated), make one
	if ( typeof this.cache.sCache[ this.state.context ] === 'undefined' ) {
		this.cache.sCache[ this.state.context ] = [];
	}

	// if current context root again, reset arrays except root
	// basically, root can persist across files potentially
	// caches above root only persist as long as they are within their context
	if ( this.state.context !== this.state.prevContext ) {
		Object.keys( this.cache.sCache ).forEach(function( val ) {
			if ( val === '0' ) { return; }
			this.cache.sCache[val] = [];
		}.bind(this));
	}

	if ( line.indexOf(',') === -1 && this.cache.prevLine.indexOf(',') === -1 && !isLineBadRe.test( line ) ) {
		if ( this.cache.sCache[ this.state.context ].indexOf( arr[0] ) !== -1 ) {
			isThereADupe = true;
		}

		this.cache.sCache[ this.state.context ].push( arr[0] );
	}

	if ( isThereADupe === true ) {
		this.cache.warnings.push( 'duplicate property or selector, consider merging' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isThereADupe;
};
