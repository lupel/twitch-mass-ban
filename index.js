require( 'dotenv' ).config({ path: './auth.env' });
const _tmi = require( 'tmi.js' );
const _fs  = require( 'fs' );

const sleep = async ( waitTimeInMs ) => new Promise( resolve => setTimeout( resolve, waitTimeInMs ) );

const globals = {
  script: process.argv[1],
  channel: process.argv[2],
  file: process.argv[3]
}

const options = {
  options: { debug: false },
  connection: { reconnect: true, secure: true },
  identity: { username: process.env.TWITCH_USERNAME, password: process.env.TWITCH_OAUTH },
  channels: globals.channel.split( '/' )
}

const client = new _tmi.client(options);
client.connect();
client.on( 'connected', doIt );


const timeToWait = 1;


async function doIt(){
  _fs.readFile( globals.file, 'utf8', async ( error, fileData )=>{
    if( error ){
      throw error;
    }

    let banList  = fileData.replace( /\r\n/g, ' ' ).split( ' ' );
    let banQueue = banList;

    if( banQueue.length!=0 ){
      let _channels = globals.channel.split( '/' );

      do{
        for( let _c=0; _c<_channels.length; _c=_c+1 ){
          _channel = _channels[_c].toString();

          client.say( _channel, `/ban ${banQueue[0].toString()} "${banQueue[0].toString()} Auto Ban"` )
          console.log( `#${_channel} | ${banQueue[0].toString()} Auto Ban` );
          await sleep( timeToWait*1000 );
        };

        console.log( ' ' );

        banQueue.shift();
      }while( banQueue.length!=0 );
    }

	if( banQueue.length==0 ){
      console.log( '\nFinished.' );
      process.exit( 0 );
	}
  });
}
