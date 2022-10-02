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

// Global constants
var JT_RSA_TESTS = 3;

// rsaGetRandom(n)
// returns random Bignum size 0..n-1
function rsaGetRandom(n) {
    var bnRet = new Bignum("",1);

    var i = 0;
    var j = 0;
    var k = 0;
    var m = 0;

    var key = new String("");
    var tmp;
    var ms;
    var ms2 = 0;

    while(i<8) {
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

    do {
	while(i<n.byteString.length) {

	    k = e.next();

	    if(j == 0) {
		m = n.byteString.charCodeAt(i);
		if(m < k) {
		    i = 0;
		    bnRet.byteString = "";
		    continue;
		}
		else if(m > k)
		    j = 1;
	    }

	    bnRet.byteString += String.fromCharCode(k);

	    i++;
	}

    } while (k < n.byteString.charCodeAt(i))

    return bnRet;
}


function rsaWitness(a,n) {
    var st = self.status;

    var i = 0;
    var d = new Bignum("",1);
    var x = new Bignum("",1);
    var nMinus1 = n.clone();

    nMinus1.decrement();

    d.hexSet("01",1);

    var bArr = nMinus1.toBitArray();

    while(bArr[i] == 0)
	i++;

    for(;i<bArr.length;i++) {
	self.status = st + " Witness: " + i + " -- " + bArr.length;

	x.copy(d);
	d = d.multiply(d,d);
  	d = d.mod(n);

	if(d.isOne() == 1)
	    if((x.isOne() == 0) && (x.absCompare(nMinus1) != 0)) {
		self.status = st;
		return 1; // composite
	    }

	if(bArr[i] == 1) {
	    d = d.multiply(d,a);
	    d = d.mod(n);
	}

    }

    self.status = st;

    if(d.isOne() == 0)
	return 1; // composite

    return 0; // prime
}


function rsaIsPrime(n,s) {
    var st = self.status;
    n.strip();
    var i=0;

    if(n.isEven() == 1) 
	return 0;

    for(i=1;i<=s;i++) {
	self.status = st + " Strong canditate! Test " + i + "/" + s;

	a = rsaGetRandom(n);

	if(rsaWitness(a,n) == 1) {
	    self.status = st;
	    return 0;
	}
    }

    self.status = st;
    
    return 1;
}

function rsaPseudoprime() {
    var d = new Bignum("",1);
    var bnTmp;

    d.hexSet("015469a7",1);
    bnTmp = this.gcd(d);
    if(bnTmp.isOne() != 1)
	return 1; // composite of 3, 7, b, d, 11, 13 or 17

    return 0;
}

Bignum.prototype.pseudoprime = rsaPseudoprime;

function rsaRandomPrime(n) {
    var st = new String();;

    var tmp = new String;
    var bnTmp = new Bignum("",1);
    var i=0;

    tmp = String.fromCharCode(1);

    for(;i<n;i++)
	tmp += String.fromCharCode(0);

    bnTmp.set(tmp,1);

    bnTmp = rsaGetRandom(bnTmp);

    if(bnTmp.isEven() == 1)
	bnTmp.increment();

    i=0;

    for(;;) {
	self.status = st + (n*8) + "bit random prime candidate: " + ++i;

	if(bnTmp.pseudoprime() == 0)
	    if(rsaIsPrime(bnTmp,JT_RSA_TESTS) == 1)
		break;

	bnTmp.increment();
	bnTmp.increment();
    }

    self.status = st;

    return bnTmp;
}


