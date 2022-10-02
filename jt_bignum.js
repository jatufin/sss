// --------------------------------------------------
// FILE: jt_bignum.js
// Simple Script Security 0.85b
// (C) 2000 Janne Tuukkanen ( jatu@projannet.port5.com )
// no any kind of warranties or promises; if you use it, you suffer it
// free for use, modificate and distribute
//
// Functions for big integer handling
//
// Following JavaScript files needed:
// jt_std.js

// bnSet(s,d)
// set the member variable values
function bnSet(s,d) {

    this.byteString = s;
    this.sign = d;

    this.strip();

}

function bnClone() {
    
    return new Bignum(this.byteString, this.sign);

}

function bnCopy(a) {

    this.byteString = new String(a.byteString);
    this.sign = a.sign;

}

// bnStrip()
// Strip the leading zeroes
function bnStrip() {

    var i = 0;
    
    for(i=0;i<this.byteString.length;i++)
	if (this.byteString.charCodeAt(i) != 0)
	    break;

    if(i>0)
	this.byteString = this.byteString.substring(i);
}

// bnToBitArray()
// return array containing each individual bits of Bignum
function bnToBitarray() {
    var retArray = new Array(this.byteString.length * 8);
    var i = 0;
    var j = 0;

    for(i=0;i<this.byteString.length;i++) {
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x80) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x40) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x20) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x10) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x8) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x4) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x2) == 0 ? 0 : 1;
	retArray[j++] = (this.byteString.charCodeAt(i) & 0x1) == 0 ? 0 : 1;
    }

    return retArray;
}

// bnIsZero()
// return 1 if Bignum is zero, otherwise 0
function bnIsZero() {
    this.strip();

    if (this.byteString.length == 0)
	return 1;

    return 0;
}

// bnIsOne()
// return 1 if Bignum is zero, otherwise 0
function bnIsOne() {
    this.strip();

    if((this.byteString.length == 1) && (this.byteString.charCodeAt(0) == 1))
	return 1;

    return 0;
}

function bnIsEven() {
    if((this.byteString.charCodeAt(this.byteString.length - 1) % 2) == 0)
	return 1;

    return 0;
}

function bnHexSet(s,d) {
    var tmpStr = new String(s);

    // there should be even number of hex digits
    // to make correct octet stream
    if((tmpStr.length % 2) != 0)
	tmpStr = "0" + tmpStr;

    this.byteString = hex2str(tmpStr);
    this.strip();

    if(d < 0)
	this.sign = -1;
    else
	this.sign = 1;
}

// bnUnsignedCompare(a)
// a and b are Bignums
// returns
// -1 if abs(this) is bigger
//  0 if abs(a) and abs(this) are equal
//  1 if abs(a) is bigger
function bnUnsignedCompare(a) {
    this.strip();
    a.strip();

    // a is obviously larger
    if(this.byteString.length > a.byteString.length)
	return -1;

    // b is obviously larger
    if(a.byteString.length > this.byteString.length)
	return 1;

    // a and b are equal
    if(this.byteString.toString() == a.byteString.toString())
	return 0;

    var sLen = this.byteString.length-1;
    var i=0;

    for(; i<=sLen; i++)
	if(this.byteString.charCodeAt(i) > a.byteString.charCodeAt(i))
	    return -1;
	else if(a.byteString.charCodeAt(i) > this.byteString.charCodeAt(i))
	    return 1;

    // How this could happen?
    return NaN;
}

// bnToString()
// return unsigned hexadecimal representation of the bignum
function bnToString() {
    this.strip();

    if(this.byteString.length == 0)
	return("00");

    return str2hex(this.byteString);

}

// bnAlert(m);
// shows inner state of Bignum in alert box with given message
function bnAlert(m) {

    alert(m + "\n" + this + "\nSign: " + this.sign);

}

// bnIncrement()
// increment the Bignum by one
function bnIncrement() {
    if(this.isZero() == 1) {
	this.byteString = String.fromCharCode(1);
	return;
    }

    var i = this.byteString.length - 1;
    
    var d = 0;
    var k = 0;
    var retStr = new String();

    for(;i>=0;i--) {
	d = this.byteString.charCodeAt(i);
	d++;

	if(d <= 0xff) {
	    retStr = String.fromCharCode(d) + retStr;
	    break;
	}

	retStr = String.fromCharCode(0) + retStr;
    }

    if(retStr.charCodeAt(0) == 0)
	this.byteString = String.fromCharCode(1) + retStr;
    else
	this.byteString = new String(this.byteString.substring(0,i) + retStr);
}

// bnDecrement()
// Decrement the Bignum by one
function bnDecrement() {
    var i = this.byteString.length - 1;
    var d = 0;
    var k = 0;
    var retStr = new String();

    for(;i>=0;i--) {
	d = this.byteString.charCodeAt(i);

	if(d != 0) {
	    d--;
	    retStr = String.fromCharCode(d % 0x100) + retStr;
	    break;
	}

	retStr = String.fromCharCode(0xff) + retStr;
    }

    this.byteString = new String(this.byteString.substring(0,i) + retStr);
}
	
// bnUnsignedSum(a,b)
// calculates the sum of absolute values of two Bignums. 
function bnUnsignedSum(a,b) {

    if(a.isZero() == 1)
	return new Bignum(b.byteString,b.sign);

    if(b.isZero() == 1)
	return new Bignum(a.byteString,b.sign);

    var tmpStr = "";
    var aStr = new String(a.byteString);
    var bStr = new String(b.byteString);

    var aLen = aStr.length;
    var bLen = bStr.length;

    var i = aLen - bLen;;
    var j = 0;
    var k = 0;

    // leading zeroes for shorter number
    for(j = Math.abs(i);j>0;j--)
	tmpStr += String.fromCharCode(0);

    if(i < 0)
	aStr = tmpStr + aStr;
    else if(i > 0)
	bStr = tmpStr + bStr;

    // sum loop
    tmpStr = "";
    j = 0;

    for(i=aStr.length - 1;i>=0;i--) {
	j = aStr.charCodeAt(i) + bStr.charCodeAt(i);
	j += k;

	if(j >= 0x100)
	    k = 1;
	else
	    k = 0;

	tmpStr = String.fromCharCode(j % 0x100) + tmpStr;
    }

    if(k == 1)
	tmpStr = String.fromCharCode(1) + tmpStr;

    return new Bignum(tmpStr,1);
}

// bnUnsignedAdd(a)
// calculates the sum of absolute values of two Bignums. 
function bnUnsignedAdd(a) {

    if(this.isZero() == 1) {
	this.set(a.byteString,a.sign);
	return;
    }

    if(a.isZero() == 1)
	return; 

    var n = this.byteString.length - a.byteString.length;

    if(n > 0) {
	aStr = this.byteString;
	bStr = a.byteString;
    } else {
	aStr = a.byteString;
	bStr = this.byteString;
    }



    var tmpStr = "";
    var j = 0;
    var k = 0;

    var i = aStr.length - 1;
    n = bStr.length - 1;

    for(;i>=0;i--,n--) {
	j = k + aStr.charCodeAt(i);

	if(n >= 0)
	    j += bStr.charCodeAt(n);
	else if(k == 0) {
	    tmpStr = aStr.substr(0,i+1) + tmpStr;
	    break;
	}


	if(j >= 0x100)
	    k = 1;
	else
	    k = 0;

	tmpStr = String.fromCharCode(j % 0x100) + tmpStr;
    }

    if(k == 1)
	tmpStr = String.fromCharCode(1) + tmpStr;

    this.set(tmpStr,1);

}

function bnUnsignedSubtract(a,b) {

    if(a.isZero() == 1)
	return new Bignum(b.byteString,b.sign);

    if(b.isZero() == 1)
	return new Bignum(a.byteString,b.sign);

    var tmpStr = "";

    // as in school, only smaller number can be
    // subtracted from bigger one
    var j = a.absCompare(b);

    if(j == 0)
	return new Bignum("",1);

    if(j < 0) {
	aStr = a.byteString;
	bStr = b.byteString;
    } else if(j > 0) {
	aStr = b.byteString;
	bStr = a.byteString;
    }

    // leading zeroes for shorter number
    var i = aStr.length - bStr.length;;

    j = Math.abs(i)

    for(;j>0;j--)
	tmpStr += String.fromCharCode(0);

    if(i < 0)
	aStr = tmpStr + aStr;
    else if(i > 0)
	bStr = tmpStr + bStr;

    var k = 0;
    var n = 0;
    var o = 0;
    var p = 0;
    var sLen = aStr.length;
    var tmpStr = "";

    for(i = sLen - 1; i>=0; i--) {
	o = aStr.charCodeAt(i) - k; // k is borrowing flag
	p = bStr.charCodeAt(i);

	k = (o >= p) ? 0 : 1;
	
	o += k * 0x100;

	n = ((o - p) % 0x100);
	tmpStr =  String.fromCharCode(n) + tmpStr;
    }

    return new Bignum(tmpStr,1);
    
}

function bnMultiplyByOneDigit(n) {
    if(n == 0) {
	this.byteString = new String("");
	return;
    }

    if(n == 1)
	return;

    var o = 0;
    var p = 0;
    var k = 0;
    var retStr = new String();

    var i = this.byteString.length - 1;

    for(;i>=0;i--) {
	o = this.byteString.charCodeAt(i);
	p = n * o + k;

	k = Math.floor(p / 0x100);
	p = p % 0x100;

	retStr = String.fromCharCode(p) + retStr;
    }

    if(k != 0)
	retStr = String.fromCharCode(k) + retStr;

    this.set(retStr,1);

}


// bnUnsignedMultiply(a,b)
function bnUnsignedMultiply(a,b) {
    var i = a.byteString.length - 1;
    var k = b.byteString.length;

    var zStr = new String("",1);
    var bnTmp = b.clone();
    var bnRet = new Bignum("",1);

    for(;i>=0;i--) {
	bnTmp.oneDigitMultiply(a.byteString.charCodeAt(i));
	bnTmp.byteString +=  zStr;
	
	bnRet.add(bnTmp);

	zStr += String.fromCharCode(0);
	bnTmp.copy(b);
    }

    return bnRet;
}

function bnMultiplyBy2() {

    this.oneDigitMultiply(2);

}

// Russian peasant's multiplication for a * b mod c
// looks good, but is not
// sometimes base 256 is better than base 2 ;)
function bnMultiplyRus(a,b) {
    var bArr;
    var bnTmp;
    var bnRet = new Bignum("",1);

    var n = 1;
    var i = 0;
    var k = 0;

    bArr = a.toBitArray();
    bnTmp = b.clone();

    for(i=bArr.length - 1; i>=0; i--) {
	if(bArr[i] != 0) {
	    bnTmp.oneDigitMultiply(n);
	    bnRet.add(bnTmp);
	    n = 1;
	}
    
	n *= 2;
	if(n >= 0xff) {
	    bnTmp.oneDigitMultiply(n);
	    n = 1;
	}

    }

    return bnRet;
}
function bnDivideBy2() {

    if (this.isZero() == 1)
	return;

    var sLen = this.byteString.length;
    var retStr = new String();
    var i = 0;
    var n = 0;
    var d = 0;

    for(i=0; i < sLen; i++) {
	d = this.byteString.charCodeAt(i);
	retStr += String.fromCharCode((d / 2) + n);
	n = (d % 2) * 0x80;
    }

    this.byteString = retStr;
}

function bnDivisionHelper(a,b) {
    var low = 0;
    var high = 0xff;
    var mid;
    var n;

    var tmp = b.clone();

    while(low != high) {
	tmp.copy(b);
	mid = Math.floor((low + high + 1) / 2);
	tmp.oneDigitMultiply(mid);

	n = tmp.absCompare(a);

	if(n < 0)
	    high = mid - 1;
	else
	    low = mid;
    }

    return low;
}
    
function bnDivision(a,b) {
    a.strip();
    b.strip();

    var tmp1 = new Bignum("",1);
    var tmp2 = new Bignum("",1);
    var tmpStr = new String("");
    
    var i = b.byteString.length;
    var j = 0;

    tmp1.byteString = a.byteString.substr(0,i);

    for(;;) {
	tmp2.copy(b);

	j = bnDivisionHelper(tmp1,tmp2);
	tmpStr += String.fromCharCode(j);

	if(j != 0) {
	    tmp2.oneDigitMultiply(j);
	    tmp1 = tmp1.subtract(tmp1,tmp2);
	}

	if(i >= a.byteString.length)
	    break;

	tmp1.byteString += a.byteString.substr(i,1);
	i++;

    }

    tmp1.set(tmpStr,1);

    return tmp1;
}

// bnMod(a)
// modulus of the Bignum to a
function bnMod(a) {
    this.strip();
    a.strip();

    var tmp1 = new Bignum("",1);
    var tmp2 = new Bignum("",1);
    
    var i = a.byteString.length;
    var j = 0;

    tmp1.byteString = this.byteString.substr(0,i);

    for(;;) {
	tmp2.copy(a);

	j = bnDivisionHelper(tmp1,tmp2);

	if(j != 0) {
	    tmp2.oneDigitMultiply(j);
	    tmp1 = tmp1.subtract(tmp1,tmp2);
	}

	if(i >= this.byteString.length)
	    break;

	tmp1.byteString += this.byteString.substr(i,1);
	i++;
    }

    return tmp1;
}


// bnModExp
// Modular exponentiation of Bignum to a mod n
function bnModExp(a,n) {
    var i = 0;
    var d = new Bignum("",1);

    d.hexSet("01",1);

    self.status = "Creating bit array";

    var bArr = a.toBitArray();

    while(bArr[i] == 0)
	i++;

    for(;i<bArr.length;i++) {
	self.status = "Modular exponentation " + (i+1) + "/" + bArr.length;
	d = d.multiply(d,d);
  	d = d.mod(n);

	if(bArr[i] != 0) {
  	    d = d.multiply(d,this);
  	    d = d.mod(n);
  	}

      }
    self.status = "";

    return d;
}




function bnSqrt() {
    this.strip();

    var low = new Bignum("",1);
    var high = new Bignum("",1);

    var c = 0;
    
    c = Math.ceil(this.byteString.length / 2);

    while(c-- >= 0) {
	high.byteString += String.fromCharCode(0xff);
	if(c > 0)
	    low.byteString += String.fromCharCode(0x00);
    }    

    low.byteString = String.fromCharCode(1) + low.byteString;

    var mid;
    var tmp;

    while(low.absCompare(high) != 0) {
	mid = low.sum(low,high);
	mid.increment();
	mid.divideBy2();
	
	tmp = mid.multiply(mid,mid);

	c = tmp.absCompare(this);

	if(c < 0) {
	    high.copy(mid);
	    high.decrement();
	} else
	    low.copy(mid);

	self.status = "Low: " + low + " High: " + high;
    }

    self.status = "";

    return low;
}

function bnGcd(a) {
    var g0 = this.clone();
    var g1 = a.clone();
    var g2;

    while(g1.isZero() == 0) {
	g2 = g0.mod(g1);
	g0.copy(g1);
	g1.copy(g2);
    }

    return g0;
}

function Bignum(s,d) {
    // member variables
    this.byteString = "";
    this.sign = 1;

    // constructor
    this.set(s,d);
}


// basic methods
Bignum.prototype.set = bnSet;
Bignum.prototype.clone = bnClone;
Bignum.prototype.copy = bnCopy;
Bignum.prototype.strip = bnStrip;
Bignum.prototype.hexSet = bnHexSet;
Bignum.prototype.absCompare = bnUnsignedCompare;
Bignum.prototype.alert = bnAlert;
Bignum.prototype.toString = bnToString;	
Bignum.prototype.isZero = bnIsZero;
Bignum.prototype.isOne = bnIsOne;
Bignum.prototype.isEven = bnIsEven;

// arithmetic operations
Bignum.prototype.sum = bnUnsignedSum;
Bignum.prototype.add = bnUnsignedAdd;
Bignum.prototype.increment = bnIncrement;
Bignum.prototype.decrement = bnDecrement;
Bignum.prototype.subtract = bnUnsignedSubtract;
Bignum.prototype.multiplyRus = bnMultiplyRus;
Bignum.prototype.multiply = bnUnsignedMultiply;
Bignum.prototype.multiplyBy2 = bnMultiplyBy2;
Bignum.prototype.divideBy2 = bnDivideBy2;
Bignum.prototype.division = bnDivision;
Bignum.prototype.mod = bnMod;
Bignum.prototype.sqrt = bnSqrt;
Bignum.prototype.modExp = bnModExp;
Bignum.prototype.gcd = bnGcd;

// 'private' methods
Bignum.prototype.oneDigitMultiply = bnMultiplyByOneDigit;
Bignum.prototype.toBitArray = bnToBitarray;
