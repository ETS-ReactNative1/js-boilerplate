#!/usr/bin/env node
'use strict';

// Update notifier.
const updateNotifier = require( 'update-notifier' );
const pkg = require( '../package.json' );
updateNotifier( {pkg, shouldNotifyInNpmScript: true} ).notify();

const spawn = require( 'cross-spawn' );
const args = process.argv.slice( 2 );

const scriptIndex = args.findIndex(
	x => 'browserslist' === x || 'start' === x || 'dist' === x || 'test' === x || 'lint' === x || 'fix-pnp' === x,
);
const script = -1 === scriptIndex ? args[ 0 ] : args[ scriptIndex ];
const nodeArgs = scriptIndex > 0 ? args.slice( 0, scriptIndex ) : [];

switch ( script ) {
	case 'browserslist':
	case 'dist':
	case 'fix-pnp':
	case 'lint':
	case 'start':
	case 'test': {
		const result = spawn.sync(
			'node',
			nodeArgs
				.concat( require.resolve( '../scripts/' + script ) )
				.concat( args.slice( scriptIndex + 1 ) ),
			{stdio: 'inherit'},
		);
		if ( result.signal ) {
			if ( 'SIGKILL' === result.signal ) {
				console.log(
					'The build failed because the process exited too early. ' +
					'This probably means the system ran out of memory or someone called ' +
					'`kill -9` on the process.',
				);
			} else if ( 'SIGTERM' === result.signal ) {
				console.log(
					'The build failed because the process exited too early. ' +
					'Someone might have called `kill` or `killall`, or the system could ' +
					'be shutting down.',
				);
			}
			process.exit( 1 );
		}
		process.exit( result.status );
		break;
	}
	default:
		console.log( 'Unknown script "' + script + '".' );
		console.log( 'Perhaps you need to update @lipemat/js-boilerplate?' );
		break;
}
