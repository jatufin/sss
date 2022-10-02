// --------------------------------------------------
// FILE: jt_msg.js
// Simple Script Security 0.82
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute
//
// Functions for creating cryptographically secured message board 
//
// Following JavaScript files needed:
// jt_std.js
// jt_sha1.js
// jt_arc4.js
// jt_crc.js
// jt_sss.js
// jt_bignum.js

function decryptMessages(msgArray, psw) {
    var aL = msgArray.length;
    var i = 0;
    var retArray = new Array();

    for(i=0;i<aL;i++) {
	self.status = "Decrypting message " + i + " / " + aL;
	retArray[i]=decrypt(msgArray[i],psw);
    }

    self.status = "";

    return retArray;
}

function messagesToString(msgArray, printBadMessages) {
    var aL = msgArray.length;
    var i = 0;
    var decryptError = "Failure in data integrity. Probably wrong password.";

    var htmlMsgHead = "<html><head><title>SSS Message board</title><meta name='copyright' content='(c) 2000 by Janne Tuukkanen'><meta NAME='author' CONTENT='Janne Tuukkanen: jatu@projannet.port5.com'></head><body bgcolor='#ffffff'><h2>SSS decrypted messages</h2>Click <a href='messagesend.html'>here</a> to create new message.</p><p><a href='index.html'>Back</a> to main page.</p>";
    var htmlMsgFoot = "</body></html>";

    var separator = "<hr>";
    
    var retStr = htmlMsgHead;

    for(i=aL-1;i>=0;i--) {
	if(msgArray[i] != decryptError)
	    retStr = retStr + separator + msgArray[i];
	else
	    if  (printBadMessages == true)
		retStr = retStr + separator + "This message could not be decrypted with given password";
    }

    retStr = retStr + separator + htmlMsgFoot;

    return retStr;
}

function printMessagesInSameWindow(msgArray, psw, badMessages) {
    var decryptedMsgArray = decryptMessages(msgArray, psw);
    var msgString = messagesToString(decryptedMsgArray, badMessages);

    document.open();
    document.write(msgString);
    document.close();

    return false;
}


function sendNewMessage(f) {
    var msgStr = "<b>From: " + f.from.value + "</b></br>";
    msgStr = msgStr + "Local time: " + Date() + "<br>";
    msgStr = msgStr + "<b>Subject: " + f.subject.value + "</b><br>";
    msgStr = msgStr + f.msg.value;

    
    var sendStr = f.cgiUrl.value + "?sss_arc4msg=" + encrypt(msgStr, f.psw.value);


    location.href = sendStr;

    return false;
}

// returns n byte length random key
function createMessageKey(n) {
    var i=0;
    var tmp;
    var ms;
    var ms2;
    var key;

    while(i<n) {
	alert("Collecting chaos. Please click OK");
	tmp = new Date();
	ms = Math.floor(tmp.getMilliseconds() * 256 / 1000);
	if(ms != ms2) {
	    key += String.fromCharCode(ms);
	    ms2 = ms;
	    i++;
	}
    }

    i=0;

    var e = new arc4engine(key);

    for(i=0;i<n;i++)
	retStr += String.fromCharCode(e.next());

    return retStr;
}

function hybridEncrypt(k1,k2,msg) {
    self.status = "Creating message key";
    var mK = createMessageKey(10);

    self.status = "Symmetric encryption";
    var cM = encrypt(msg,mK);

    var cK = rsaEncrypt(mK,k1,k2);

    var cKLen = cK.lenght / 2;

    cKLen = str2hex(String.fromCharCode(cKLen));

    var retStr =  cKLen + cK + cM;

    return retStr;
}
      
// end of file
// --------------------------------------------------   
