var params = {N:0, p:2};
var sieveTimer;
var config = {timePerUpdate_ms:250, defaultNumCols:13, defaultN:300, primeBackgroundColor:'lightPink', notPrimeColor:'lightgrey'};

// indexed from 0: 0 <= n < N
function lookup(t, n)
{
	return t.rows[Math.floor(n/params.numCols)].cells[n % params.numCols];
}

function buildTable(c, nMax)
{
	//--- Stop the sieveTimer if it's already running
	if (sieveTimer != undefined)
	{
		clearTimeout(sieveTimer);
		sieveTimer = undefined;
	}

	//--- Calculate the number of rows
	var i,j,n=1,shouldStop=0;
	params.numCols=c;
	params.numRows=Math.ceil(nMax/params.numCols)

	//--- Initialize params
	params.p=2;
	params.N=nMax;
	params.isPrime = new Array(nMax); // isPrime is indexed from 0
	params.isPrime[0] = 0;
	params.isPrime[params.p-1] = 1;
	
	//--- Build table html
	str='<table id="primeTable">';
	for (i=0; i<params.numRows; i++)
	{
		str += "<tr>";
		for (j=0; j<c; j++)
		{
			str += "<td>" + n + "</td>";
			if (++n > nMax)
			{
				shouldStop = 1;
				break;
			}
		}
		str += "</tr>";
		if (shouldStop)
			break;
	}
	str += "</table>";
	return str;
}

function doTableSizeButton()
{
	var n=prompt("find all primes up to..", config.defaultN);
	if (n > 0)
		document.getElementById("primeDiv").innerHTML=buildTable(config.defaultNumCols, n);
}

function doRunButton()
{
	var n,c,t=document.getElementById('primeTable');

	//--- Mark 1 as not prime
	lookup(t,0).style.color = config.notPrimeColor;
	//--- Mark p as prime
	params.isPrime[params.p-1] = 1;
	markPrimeWithColor(t,params.p);
	// Start iterating
	sieveIter(t);
}

function doStopButton()
{
	if (sieveTimer != undefined)
	{
		clearTimeout(sieveTimer);
		sieveTimer = undefined;
	}
}

function sieveIter(t)
{
	if (params.p <= Math.floor(params.N/2))
	{
		// Erase multiples of p after a delay
		sieveTimer = setTimeout(
			function()
			{
				eraseMultiplesOf(t,params.p);
				sieveUpdateP(t);
				markPrimeWithColor(t,params.p);
				sieveIter(t);
			}, config.timePerUpdate_ms);
	} else {
		// Complete.
		// Finish marking the rest of the primes
		var p, c;
		for (p = params.p; p < params.N; p++)
		{
			if (params.isPrime[p] == undefined)
			{
				params.isPrime[p] = 1;
				markPrimeWithColor(t,p+1);
			}
		}
	}
}

function sieveUpdateP(t)
{
	var p, c;
	for (p = params.p; p < params.N; p++)
	{
		if (params.isPrime[p] == undefined)
			break;
	}
	params.isPrime[p] = 1;
	params.p = p+1;
}

function eraseMultiplesOf(t,p)
{
	var n,c;
	for (n=2*p-1; n < params.N; n += p)
	{
		if (params.isPrime[n] == undefined)
		{
			c = lookup(t, n);
			params.isPrime[n] = 0;
			c.style.color = config.notPrimeColor;
			// c.innerHTML='';
		}
	}
}

function markPrimeWithColor(t,p)
{
	var c = lookup(t,p-1);
	c.style.backgroundColor = config.primeBackgroundColor;
}