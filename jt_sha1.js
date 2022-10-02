// --------------------------------------------------
// FILE: jt_sha1.js
// SHA-1 (FIPS 180-1) hash algorithm implementation
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute
// no padding, only 56 first characters are used for hash
// supposed 32 bit unsigned integers
// JavaScript files needed:
// jt_std.js

// function getSHA1Hash(inStr)
// returns hash value for argument in array
// of five 32 bit dwords
function getSHA1Hash(keyPhrase) {
		 var keyArray = sha1CreateArray(keyPhrase);

		 var digest = sha1Compute(keyArray);
		 		 
		 /* For debugging
		 for(i=0;i<digest.length;i++) {	 
		 	document.write(digest[i].toString(16) + "<br>");
		 }
 		 */
		 
 		 return digest;
}

// functionsha1CreateArray(inStr)
// converts argument string to SHA-1 input block
// returns array containing 16 32-bit  dwords
// OBS: argument string is truncated to maximum
//      length of 56 bytes
// 8-bit characters in String assumed
function sha1CreateArray(keyPhrase) { 
		 var l = keyPhrase.length;
		 var byteArray = new Array(64);
		 var dwordArray = new Array(16);
		 
		 if (l >56) {
		 	l = 56;
		 }
		 
		 for(i=0;i<64;i++) {
		    if (i<l) {
		 	   byteArray[i] = keyPhrase.charCodeAt(i);
			}
			else {
			   byteArray[i] = 0;
			}
		 }
		 		 		 	 
		 byteArray[l] = 0x80;
		 byteArray[63] = (l*8) & 0xFF;
		 byteArray[62] = ((l*8) & 0xFF00) >>> 8;
		 
		 for(i=0;i<16;i++) {
		 	j = i * 4;
		 	x = byteArray[j] << 24;
		 	x += byteArray[j+1] << 16;
		 	x += byteArray[j+2] << 8;
		 	x += byteArray[j+3];
			
			dwordArray[i] = x;
		 }
		 						
		 return dwordArray;
}

// function sha1KBuffer()
// initiliaze K constants
// returns array containing 80 32-bit dwords
// OBS: K object might be constructed and used
//      to return apropriate K values,
//      alltough an Array _may_ be more efficient
function sha1KBuffer() {
		 var k = new Array(80);
		 
		 for(i=0;i<20;i++) {	 
		 	k[i] = 0x5A827999; // (0 =< t =< 19)
		 }
		 for(i=20;i<40;i++) {	 
		 	k[i] = 0x6ED9EBA1 // (20 =< t =< 39)
		 }
		 for(i=40;i<60;i++) {	 
		 	k[i] = 0x8F1BBCDC // (40 =< t =< 59)
		 }
		 for(i=60;i<80;i++) {	 
		 	k[i] = 0xCA62C1D6 // (60 =< t =< 79).
		 }

 		 return(k);
}

// function sha1HBuffer
// initialiaze H values, wich store hash
// function state during computation
// array containing five 32-bit dwors is returned
function sha1HBuffer() {
		 var h = new Array(0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0);

		 return h;
}

// function sha1S(dword,n)
// circular left shift for dword argument
// argument n bits
// referenced as Sn function in alogorithm
// specification
// returns shifted 32-bit dword
function sha1S(word,n) {
		 r = (word << n) | (word >>> (32-n));
		 
		 return r;
}

// function sha1Ft(B,C,D,t)
// bitwice operations between dwords B,C and D
// operations depends integer t [0...79]
// returns single 32-bit dword
function sha1Ft(B,C,D,t) {
		 if(t < 20) {
		 	  r = (B & C) | (~B & D);
		 }
		 else
		 if(t < 40) {
		 	  r = B ^ C ^ D
		 }
		 else
		 if(t < 60) {
		 	  r = (B & C) | (B & D) | (C & D)
		 }
		 else {
		 	  r = B ^ C ^ D
		 }		

		 return r;
}

// function sha1Compute(inArray)
// computes hash for given array of 32-bit dwords
// returns array containing five 32-bit dwords
function sha1Compute(dwordArray) {
		 var W = new Array(80);
		 var wA,wB,wC,wD,wE;
		 var temp;
		 var H = sha1HBuffer();
		 var K = sha1KBuffer();
		 
		 for(i=0;i<16;i++) {
		 	W[i] = dwordArray[i];
		 }
		 
		 for(i=16;i<80;i++) {
		 	W[i] = sha1S(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16],1);
		 }
		 
		 wA = H[0];
		 wB = H[1];
		 wC = H[2];
		 wD = H[3];
		 wE = H[4];

		 for(i=0; i<80; i++) {
		 	temp = sha1S(wA,5) + sha1Ft(wB,wC,wD,i) + wE + W[i] + K[i];
			wE = wD;
			wD = wC;
			wC = sha1S(wB,30);
			wB = wA;
			wA = temp;

		 }

		 H[0] += wA;
		 H[1] += wB;
		 H[2] += wC;
		 H[3] += wD;
		 H[4] += wE;
		 
		 for(i=0;i<5;i++) {
		 	H[i] &= 0xFFFFFFFF;
			   
		 }
		 
		 return H;
}


// bytes2string(inBytes)
// converts array of bytes to string of hex values
// returns String containing the argument bytes
// in concatenated hex (Array(15,15) --> "0F0F")
function bytes2String(aB) {
  var tA = new Array(4);
  var rS = new String;

  for(i=3;i>=0;i--) {
    if (aB[i] == 0)
       tA[i] = "00";
    else if (aB[i] < 16)
           tA[i] = "0" + aB[i].toString(16);
         else
           tA[i] = aB[i].toString(16);

    rS = rS + tA[i];
  }
  return rS;
}

// function sha1(inStr)
// returns 160 bit hexadecimal representation of the hash
function sha1(inStr) {
   var dWA = getSHA1Hash(inStr);
   var retStr = dWords2String(dWA);

   return retStr;
}

// end of file
// --------------------------------------------------   





