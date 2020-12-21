function roll4d6b3()
{
    const statroll1 = Math.floor(Math.random() * 6) + 1;
    const statroll2 = Math.floor(Math.random() * 6) + 1;
    const statroll3 = Math.floor(Math.random() * 6) + 1;
    const statroll4 = Math.floor(Math.random() * 6) + 1;
    const statArray = [];
    
    statArray.push(statroll1);
    statArray.push(statroll2);
    statArray.push(statroll3);
    statArray.push(statroll4);
    
    var newStatArray = removeSmallest(statArray);
    var sumStat = 0;
    for (var i = 0; i < newStatArray.length; i++) {
        sumStat += newStatArray[i]
      }
      return sumStat; 
}
function removeSmallest(numbers) {
    const smallest = Math.min.apply(null, numbers);
    const pos = numbers.indexOf(smallest);
    return numbers.slice(0, pos).concat(numbers.slice(pos + 1));
};

function standardArray()
{
    const statArray = [15,14,13,12,10,8];
    return statArray;
}

function create4d6b3StatArray()
{
    const statArray = [roll4d6b3(),roll4d6b3(),roll4d6b3(),roll4d6b3(),roll4d6b3(),roll4d6b3()];
    console.log(statArray);
    return statArray;
}

create4d6b3StatArray();
/*    const statString = '4d6kh3';

const numRolls = 6;
const finalArray = [];
const stats = Array(numRolls).fill(0).map(e=>new Roll(statString).roll());

const {faces, rolls} = stats[0].terms[0];
const totalAverage = (faces/2 + 0.5) * rolls.filter(i=> i?.discarded !== true).length;
const totalDeviation = faces/2;
const totalLow = Math.ceil(totalAverage - totalDeviation);
const totalHigh = Math.ceil(totalAverage + totalDeviation);

const header = rolls.map((roll, index) => `<th>D${index + 1}</th>`).join('');

let tableRows = '';
let finalSum = 0;
for(let {parts, total} of stats) {
  tableRows += `<tr style="text-align:center">`;
  tableRows += parts[0].rolls.map(({result}) => `<td ${colorSetter(result, 1, faces)}>${result}</td>`).join('');
  tableRows += `<td style="border-left:1px solid #000; ${colorSetter(total, totalLow, totalHigh)}">${total}</td></tr>`;
  finalArray.push(total);
  finalSum += total;
}

const colspan = `colspan="${rolls.length + 1}"`;
const center = `text-align:center;`;

let content = `
  <table>
    <tr>
      <td ${colspan}><h2 style="margin-bottom:0; ${center}">New Ability Scores</h2>
      <div style="margin-bottom: 0.5rem; ${center}">${statString} was rolled ${numRolls} times.</div></td>
    </tr>
    <tr style="${center} border-bottom:1px solid #000">
      ${header}
      <th style="border-left:1px solid #000">Total</th>
    </tr>
    ${tableRows}
    <tr style="border-top: 1px solid #000">
      <th colspan="${rolls.length}" style="${center}">Final Sum:</th>
      <th style="${center}">${finalSum}</th>
    </tr>
  </table>
`;


ChatMessage.create({content});
console.log(finalArray);

function colorSetter(number,low,high)
{
  if(number <= low) return 'color:red';
  if(number >= high) return 'color:green';
  return '';
}

return finalArray;
*/