// --------------------------------------------------
// FILE: jt_arc4.js
// ARCFOUR stream cipher implementation
// (c) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
//
// Following JavaScript files needed:
// jt_std.js


// function arc4Next()
// returns next PRNG byte from the cipher
// method of rc4engine object
function arc4Next() {
  this.ei = (this.ei+1) % 0x100;
  this.ej = (this.ej+this.s[this.ei]) % 0x100;
    
  this.s.swap(this.ei,this.ej);

  var t = (this.s[this.ei] + this.s[this.ej]) % 0x100;

  return this.s[t];
}


// arc4engine(key)
// object containing state values of the cipher
// state is initiliazed when arc4engine object
// is created.
// member function next returns next PRNG byte
function arc4engine(key) {
  this.k = new Array(256);
  this.s = new Array(256);
  this.ei = 0;
  this.ej = 0;

  this.next = arc4Next;

  var kl = key.length;
  var i=0, j=0;

  for(i=0;i<256;i++) {

     this.s[i] = i;
     this.k[i] = key.charCodeAt(j);
     if(++j == kl) j=0;
  }


  for(i=0,j=0;i<256;i++) {
     j = (j + this.s[i] + this.k[i]) % 0x100;
     this.s.swap(i,j);
  }

}

// arc4(inString,key)
// arguments:
// String inStr       The input stream, plain or ciphertext
// String key         de/encryption key
// Main operation function of ARCFOUR stream cipher
function arc4(inStr, key) {
  var e = new arc4engine(key);
  var outStr = new String;
  var sl = inStr.length;
  var i=0;

  for(i=0;i<sl; i++) {
     a = inStr.charCodeAt(i);
     b = e.next();
     outStr = outStr + String.fromCharCode(a ^ b);   
  }

  return outStr;
}
// end of file
// --------------------------------------------------   



