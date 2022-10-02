// --------------------------------------------------
// FILE: jt_crc16.js
// CRC32 (Cyclic Redundancy Check implementation
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute
//
// ISO 3309 compatible CRC-32 check sum counter
//
// Following JavaScript files needed:
// jt_std.js



// function crcTable()
// object containing 256 cell table of
// 'magic numbers', initialiazed when
// constructed
function crcTable() {
    this.table = new Array(256);
   
    var c=0;
    var i=0, k=0;
    
    for(i=0;i<256;i++) {
	c=i;
	for(k=0; k < 8; k++) {
	    if (c & 1) {
		c = 0xEDB88320 ^ (c >> 1);
	    }
	    else
		c = c >> 1;
	}
    this.table[i] = c;
    }
}

// function nextCRC(preCrc, inStr)
// returns next CRC state, the preceeding
// CRC value is given as argument
function nextCRC(preCrc,inStr) {
    var sL = inStr.length;
    var c = preCrc ^ 0xFFFFFFFF;
    var n = 0;
    var crcT = new crcTable();

    for(n=0; n < sL; n++) {
	c = crcT.table[(c ^ inStr.charCodeAt(n)) & 0xff] ^ (c >> 8);
    }

    return c ^ 0xffffffff;
}

// countCRC(str)
// returns CRC fr given string
function countCRC(str) {

    return nextCRC(0,str);

}

// function crc32(str)
// returns CRC for given string in
// hexadecimal representation
function crc32(str) {
    var c = countCRC(str);
    var cB = new dWordInBytes(c);
    
    return cB.toString;
}


// end of file
// --------------------------------------------------   


