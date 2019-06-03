/*JavaScript Test to show how a distribution of draws is*/

const stats = require("stats-lite"); 
const fs = require('fs'); 
const os = require('os');

/*random function generator*/
const getRandNum = (min, max) => {
	return(Math.floor(Math.random() * (max-min+1)) + min); 
}

const getNTrials = (nEntries, out) =>{
	let nWins = 5; 
	let winner = false; 
	let arrWin = {}; 
	let picked = ""; 
	let nTrials = 0; 

	do{
		++nTrials;
		picked = `a${getRandNum(1,nEntries)}`;
		isNaN(arrWin[picked])?arrWin[picked]=1:++arrWin[picked];
		if(arrWin[picked]==nWins)
			winner = true; 
 
	}while(winner == false);
	if(out)
		console.log(`Picked ${nTrials}`);
	
	return nTrials;
}

const runStudy = (nEntries=20, nTests = 20, out=false) => {
	let freqTrials = Array();
	let tests = 0; 
	do{
		tests++;
		freqTrials.push(getNTrials(nEntries, out));
	}while(tests < nTests);
	return(freqTrials); 
}


let allRes = Array(); 
let mean   =0; 
let median =0; 
let mode   =0;
let nsims  =100000;
let output = [];

let fields = ['n', 'mean', 'median', 'mode']; 
output.push(fields.join());

for(let nEntries=1; nEntries < 101; nEntries++)
{
	resultStudy = runStudy(nEntries, 100000);
	
	mean = stats.mean(resultStudy); 
	mode = stats.mode(resultStudy); 
	median = stats.median(resultStudy);	
	
	if (typeof mode == 'object')
	{
		mode = Math.max(...mode); 
	} 
	console.log(`Entries=${nEntries} -- mean is ${mean}`); 
	console.log(`Entries=${nEntries} -- median is ${median}`);
	console.log(`Entries=${nEntries} -- mode is ${mode}`);
	console.log("\n");
	
	allRes.push({'n':nEntries, 'mean':mean, 'mode':mode, 'median':median});
}

allRes.forEach((d) =>{
	const row = []; 
	row.push(d.n); 
	row.push(d.mean);
	row.push(d.mode);
	row.push(d.median);

	output.push(row.join()); //by default it is , that joins all
}); 

fs.writeFileSync("./output.csv", output.join(os.EOL));
