// --------------------------------------------------
// FILE: jt_rsa.js
// Simple Script Security 0.85b
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute
//
// Functions for RSA public key en/decryption and messages
//
// Following JavaScript files needed:
// jt_std.js
// jt_arc4.js
// jt_sha1.js
// jt_crc.js
// jt_sss.js
// jt_bignum.js

// rsaEncrypt(msg,k1,k2)
// msg - String containing the message to be encrypted
// k1 first part of public key as hexadecimal string (e)
// k2 second part of public key (n)
function rsaEncrypt(msg,k1,k2) {
    var bnMsg = new Bignum(msg,1);
    var bnE = new Bignum("",1);
    var bnN = new Bignum("",1);
    var bnC;

    bnE.hexSet(k1,1);
    bnN.hexSet(k2,1);

    self.status = "Modulax exponentation";

    bnC = bnMsg.modExp(bnE,bnN);

    self.status = "";

    return bnC.toString();
}
