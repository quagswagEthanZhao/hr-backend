const arr = [
  { name: 'SNOW MAN', department_name: 'IT' },
  { name: 'YIXIN', department_name: 'IT' },
  { name: 'ETHAN', department_name: 'IT' },
  { name: 'SHELLY B', department_name: 'BILL' },
  { name: 'ANDREW SMITH', department_name: 'BILL' },
  { name: 'HANNA HOKING', department_name: 'BILL' },
  { name: 'EEASTON PETERSON', department_name: 'CUSTOMER SERVICES' },
];
const findnum = (arr) => {
  let outcome = [];
  let resoult = [1];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i + 1] == undefined) {
      if (resoult[0] > 1) {
        resoult.push(arr[i].department_name);
        outcome.push(resoult);
        return outcome;
      } else {
        resoult.push();
        resoult.push(arr[i].department_name);
        outcome.push(resoult);
        return outcome;
      }
    }
    if (arr[i].department_name === arr[i + 1].department_name) {
      resoult[0]++;
    } else {
      resoult[1] = arr[i].department_name;
      outcome.push(resoult);
      resoult = [1];
    }
  }
  return outcome;
};

console.log(findnum(arr));
