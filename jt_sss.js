// --------------------------------------------------
// FILE: jt_sss.js
// Simple Script Security 0.82
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute
// Following JavaScript files needed:
// jt_std.js
// jt_sha1.js
// jt_crc.js
// jt_arc4.js

// Start and end sections of generated HTML code
var htmlHead = "<html><head><title>SSS password protected page</title><meta name='copyright' content='(c) 2000 by Janne Tuukkanen'><meta NAME='author' CONTENT='Janne Tuukkanen: jatu@projannet.port5.com'><script type='text/javascript' src='jt_std.js'></script> <script type='text/javascript' src='jt_crc.js'></script> <script type='text/javascript' src='jt_sha1.js'></script> <script type='text/javascript' src='jt_arc4.js'></script><script type='text/javascript' src='jt_sss.js'></script><script language='JavaScript'>"

var htmlFoot = "</script></head><body bgcolor='#ffffff'><font size=-1><i>Secured with <a href='http://projannet.port5.com'>SSS</a></i></font><center>Please enter your password:<form name='f1' onsubmit='return openInSameWindow(cArray,this.pass.value);'><input type='password' name='pass'><br><input type='submit' value='OK'></form></center></body></html>"


// function salt()
// returns String containing two random bytes
// used for salting the password
function salt() {
  var i = Math.floor(Math.random() * 100000000000000000);
  var s = hex2str(sha1(new String(i)));

  return s.substr(0,2);
}

function genKey(psw,slt) {

   return hex2str(sha1(psw.substr(0,54) + slt));
}

// function encrypt(inStr,psw)
// inStr in encrypted using psw as key
// two byte salt is generated and concatenated
// front of the ciphertext string
function encrypt(inStr,psw) {
  var slt = salt();
  var cS = hex2str(crc32(inStr));

  return str2hex(slt + arc4(cS + inStr,genKey(psw,slt)));
}

// function decrypt(inStr,psw)
// two byte salt is extracted from front of
// the ciphertext. Key is then genrated and
// rest of the ciphertext decrypted
function decrypt(inStr,psw) {
  var tS = hex2str(inStr);
  var slt = tS.substr(0,2);

  var plStr = arc4(tS.substr(2), genKey(psw,slt));
  tS = plStr.substr(4);

  var cS = hex2str(crc32(plStr.substr(4)));

  if (cS != plStr.substr(0,4))
	return "Failure in data integrity. Probably wrong password.";


  return plStr.substr(4);
}


// function openInNewWindow(inStr,psw)
// decrypts data found in inStr,
// opens new browser window and writes
// decrypted data to it
function openInNewWindow(inStr,psw) {
   w = window.open("", "Secrets", "toolbar=no,status=no,menubar=0,location=no,width=600,height=400,scrollbars=yes");
   var tStr = decrypt(inStr,psw);


   w.document.open();
   w.document.write(tStr);
   w.document.close();

   return false;
}

// function openInSameWindow(inStr,psw)
// decrypts data found in variable inStr,
// and writes decrypted data to current
// document window
function openInSameWindow(inStr,psw) {

   var tStr = decryptArray(inStr,psw);


   // add this to redirect to 'wrong password' page
   // ---------------------------
   //     if(tStr.indexOf("Failure in data integrity. Probably wrong password.") != -1) {
   //     location.href="http://www.domain.invalid/error/";
   //       return;
   //   }
   // ---------------------------


   document.open();
   document.write(tStr);
   document.close();

   return false;
}

// function encryptToArray(str,psw)
// encryptes argument str with password psw
// to an array containing 0xff sized strings
function encryptToArray(str,psw) {
    var b = Math.ceil(str.length / 0xfff);
    var i = 0;
    var retA = new Array(b);

    for(i=0;i<b;i++) {
	psw = hex2str(sha1(psw)); // different password for each array block
	self.status = "Encrypting block " + (i+1)  + " / " + b;
	retA[i] = encrypt(str.substr(i * 0xfff, 0xfff),psw);
    }

    self.status = "Done";
    return retA;
}

// function decryptArray(inA, psw) {
// decrypts data stored in array containing
// encrypted strings
function decryptArray(inA, psw) {
    var aL = inA.length;
    var i = 0;
    var retStr = new String();

    for(i=0;i<aL;i++) {
	psw = hex2str(sha1(psw)); // different password for each array block
	self.status = "Decrypting block " + (i+1)  + " / " + aL;
	retStr = retStr + decrypt(inA[i],psw);
    }

    self.status = "Done";

    return retStr;
}







