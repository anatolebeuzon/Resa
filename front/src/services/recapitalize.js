/*
* Recapitalize names
* In database, some firstnames/lastnames are saved as "JOHN" "DOE"
* Change capitalization to "John" "Doe"
*/

export default text =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
