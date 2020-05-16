import moment from 'moment';

export function getYears() {
 const years = [];
 const dateStart = moment().subtract(10, 'y');
 const dateEnd = moment();
 while (dateEnd.diff(dateStart, 'years') >= 0) {
   years.push({
     value: dateStart.format('YYYY'),
     label: dateStart.format('YYYY')
   });
   dateStart.add(1, 'year');
 }
 return years;
}

export function getMonths() {
 const months = [];
 const dateStart = moment().startOf('year');
 const dateEnd = moment().startOf('year').add(12, 'month');
 while (dateEnd.diff(dateStart, 'month') > 0) {
   months.push({
     value: dateStart.format('MMMM'),
     label: dateStart.format('MMMM')
   });
  dateStart.add(1, 'month');
 }
 return months;
}
