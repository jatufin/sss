// --------------------------------------------------
// FILE: jt_std.js
// JavaScript function for general use
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute

// function swap(int i,j)
// member function for Array objects
// swaps items at positions i and j
// no error checking
function arraySwap(i,j) {
  var a = this[i];
  this[i] = this[j];
  this[j] = a;
}
Array.prototype.swap = arraySwap;

function arrayPrintSrc(name) {
   var aL = this.length;
   var i = 0;
   var retStr = new String("var " + name + " = new Array(" + aL + "); ");

   for(i=0;i<aL;i++) {
	retStr = retStr + name + "[" + i +"] = '" + this[i] + "'; ";         
   }

   return retStr;
}

Array.prototype.printSrc = arrayPrintSrc;

// function twoCharHex(i)
// returns string representation of i in hex
// 0xFF --> "FF"
// 0x01 --> "01"
function twoCharHex(i) {
   if (i==0)
      return "00";
   else if (i < 16)
           return "0" + i.toString(16);

   return i.toString(16);
}

// function str2hex(inString)
// returns ASCII hex values of characters,
//    i.e. "AA" --> "4141"
function str2hex(inStr) {
   var l = inStr.length;
   var i=0;
   var retStr = new String;

   for(i=0;i<l;i++) {
      retStr = retStr + twoCharHex(inStr.charCodeAt(i));
   }

   return retStr;
}

// function hex2str(inStr)
// "4141" --> "AA"
function hex2str(inStr) {
   var l = inStr.length;
   var retStr = new String;
   var i=0;

   for(i=0; i<l; i+=2) {
     retStr = retStr + String.fromCharCode("0x" + inStr.substr(i,2));
   }

   return retStr;
}


// function dWordInBytes(dW)
// an object constructed from argument 32-bit dword
// contains four 8-bit bytes separated from argument
function dWordInBytes(dW) {
  this.rB = new Array(4);

  this.rB[0] = dW & 0x000000FF;
  this.rB[1] = (dW & 0x0000FF00) >>> 8;
  this.rB[2] = (dW & 0x00FF0000) >>> 16;
  this.rB[3] = (dW & 0xFF000000) >>> 24;

  this.toString = bytes2String(this.rB); // returns hex representation of the object
}

// function dWordInBytesFromString(str)
// constructs dWordInBytes from four first characters
// of argument
//  function dWordInBytesFromString(str) {
//  	var retDw = new dWordInBytes(0);
//
//  	retDw.rB[0] = str.charCodeAt(0);
//  	retDw.rB[1] = str.charCodeAt(1);
//  	retDw.rB[2] = str.charCodeAt(2);
//  	retDw.rB[3] = str.charCodeAt(3);

//  	return retDw;
//  }

// function dWords2String(dWA)
// argument dWA is array of 32-bit dwords
// returns concatenated hex representation of
// argument dwords
// dWords2String(Array(0xFF0A12AA, 0xFF00FF00))
//   --> String("FF0A12AAFF00FF00")
function dWords2String(dWA) {
   var i=0;
   var retStr = new String;
   var aL = dWA.length;
   var d = new String;
   
   for(i=0;i<aL;i++) {
      d = new dWordInBytes(dWA[i]);
      retStr = retStr + d.toString;
   }

   return retStr;
}
      
// end of file
// --------------------------------------------------   
   










