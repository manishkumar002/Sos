// import { createClient } from 'agora-rtc-sdk-ng';

// const APP_ID = 'dc70b83e0dfc4303aa39415486cc109e';
// const TOKEN =
//   '007eJxTYHg3XbFzZjy3yd/n84QUf8aoKa+KjOHymNYqZz41y7vCa5MCg4mZRaKxoaGpkXmyhUlyqlmiqWlyipGJqVmaWZq5ZYqlfdar9IZARobWrc+ZGBkgEMRnYchNzMxjYAAArcgdvA==';
// const CHANNEL_NAME = 'main';

// const client = createClient({ mode: 'rtc', codec: 'vp8' });

// export const AgoraService = {
//   client,
//   APP_ID,
//   TOKEN,
//   CHANNEL_NAME,
// };




import { createClient } from 'agora-rtc-sdk-ng';

const APP_ID = '468a311527c84ce6a55cd2456f6f79d9';
const TOKEN =
  '007eJxTYKiePGuiPv9Mla9S0htma/SGPj6tNHNtp8usz58WWd4LOiKqwGBiZpFobGhoamSebGGSnGqWaGqanGJkYmqWZpZmbpli2bDjR3pDICOD4jZ2RkYGCATxWRhyEzPzGBgATOsfdg==';
const CHANNEL_NAME = 'main';

const client = createClient({ mode: 'rtc', codec: 'vp8' });

export const AgoraService = {
  client,
  APP_ID,
  TOKEN,
  CHANNEL_NAME,
};