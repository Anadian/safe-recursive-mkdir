#!/usr/local/bin/node
'use strict';
/**
* @file safe-recursive-mkdir.js
* @brief Safely use mkdirSync in recursive mode with less code.
* @author Anadian
* @copyright 	Copyright 2019 Canosw
	Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:
	The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Dependencies
	//Internal
	//Standard
	const FileSystem = require('fs');
	const Utility = require('util');
	//External

//Constants
const FILENAME = 'safe-recursive-mkdir.js';
const MODULE_NAME = 'SafeRecursiveMKDIR';
var PROCESS_NAME = '';
if(require.main === module){
	PROCESS_NAME = 'safe-recursive-mkdir';
} else{
	PROCESS_NAME = process.argv0;
}

//Global Variables
var Logger = { 
	log: () => {
		return null;
	}
};
//Functions
function Logger_Set( logger ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Logger_Set';
	//Variables
	var function_return = [1,null];

	//Parametre checks
	if( typeof(logger) === 'object' ){
		if( logger === null ){
			logger = { 
				log: () => {
					return null;
				}
			};
		}
	} else{
		_return = [-2,'Error: param "logger" is not an object.'];
	}

	//Function
	if( _return[0] === 1 ){
		Logger = logger;
		_return = [0,null];
	}

	//Return
	return _return;
}
/**
* @fn SafeRecursiveMKDIR
* @brief Create a directory, recursively, using FileSystem.mkdirSync.
* @param directory_path
*	@type String
*	@brief The path to the directory to create.
*	@default null
* @return <ARRAY>
*	@entry 0 
*		@retval 1 premature return.
*		@retval 0 on success.
*		@retval <0 on failure.
*	@entry 1
*		@retval <object> on success
*		@retval <error_message> on failure.
*/
function SafeRecursiveMKDIR( directory_path ){
	var _return = [1,null];
	const FUNCTION_NAME = 'SafeRecursiveMKDIR';
	//Variables

	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: ', arguments)});
	//Parametre checks
	if( directory_path == undefined || typeof(directory_path) !== 'string' ){
		_return = [-2, 'Error: param "directory_path" is either null or not a string.'];
	}
	
	//Function
	if( _return[0] === 1 ){
		try{
			FileSystem.mkdirSync( directory_path, { recursive: true } );
			_return = [0,null];
		} catch(error){
			_return = [-4, Utility.format('FileSystem.mkdirSync threw: %s', error)];
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: _return[1]});
		}
	}

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: ', _return)});
	return _return;
}

//Exports and Execution
if(require.main === module){
	var _return = [1,null];
	const FUNCTION_NAME = 'MainExecutionFunction';
	//Dependencies
		//Internal
		//Standard
		//External
		const ApplicationLogWinstonInterface = require('application-log-winston-interface');
		const EnvPaths = require('env-paths');
	//Constants
	const EnvironmentPaths = EnvPaths( PROCESS_NAME );
	//Variables
	var function_return = [1,null];
	var directory_paths = [];
	var loop_error_string = '';
	//Logger
	function_return = SafeRecursiveMKDIR( EnvironmentPaths.log );
	function_return = ApplicationLogWinstonInterface.InitLogger('debug.log', EnvironmentPaths.log);
	if( function_return[0] === 0 ){
		Logger_Set( function_return[1] );
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'Start of execution block.'});
	//Options
	if( process.argv.length > 2 ){
		directory_paths = process.argv.slice(2);
	}
	//Config
	//Main
	for( var i = 0; i < directory_paths.length; i++ ){
		function_return = SafeRecursiveMKDIR( directory_paths[i] );
		if( function_return[0] !== 0 ){
			loop_error_string += Utility.format(' For loop index: %d: SafeRecursiveMKDIR(%s) returned: %d, "%s" |', i, directory_paths[i], function_return[0], function_return[1]);
		}
	}
	if( loop_error_string === '' ){
		_return = [0,null];
	} else{
		_return = [-8, loop_error_string];
	}
	process.exitCode = _return[0];
	if( _return[0] !== 0 ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: Utility.format('%o', _return)});
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'End of execution block.'});
} else{
	exports.SetLogger = Logger_Set;
	exports.mkdirSyncRecursiveSafe = SafeRecursiveMKDIR;
}
