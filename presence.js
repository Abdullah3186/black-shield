import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,signInAnonymously,browserLocalPersistence,setPersistence,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signOut,inMemoryPersistence} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {getDatabase,ref,push,set,onDisconnect,onValue,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-database.js';
const config={"apiKey":"AIzaSyAmRzKgdy4fjUeILlGaX8XepOUe0JRGDaw","authDomain":"black-shield-458e1.firebaseapp.com","databaseURL":"https://black-shield-458e1-default-rtdb.firebaseio.com","projectId":"black-shield-458e1","appId":"1:165406767425:web:832441bae7224fe5e909c0"};
async function start(){
 if(location.protocol!=='https:'||!navigator.onLine)return;
 const app=initializeApp(config,'blackshield-presence'),auth=getAuth(app),db=getDatabase(app);
 await setPersistence(auth,browserLocalPersistence);
 await auth.authStateReady();
 const user=auth.currentUser|| (await signInAnonymously(auth)).user;
 if(!user.isAnonymous)return;
 let generation=0;
 onValue(ref(db,'.info/connected'),async snap=>{
   const g=++generation;if(snap.val()!==true)return;
   try{
     const conn=push(ref(db,'presence/'+user.uid));
     await onDisconnect(conn).remove();
     if(g!==generation)return;
     await set(conn,serverTimestamp());
     await set(ref(db,'visitors/'+user.uid),true);
   }catch(e){console.warn('Presence unavailable',e.code||'unknown');}
 });
}
let started=false;function launch(){if(started||!navigator.onLine||location.protocol!=='https:')return;started=true;start().catch(e=>{started=false;console.warn('Presence unavailable',e.code||'unknown');});}
launch();window.addEventListener('online',launch);
