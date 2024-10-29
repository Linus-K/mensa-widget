// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: utensils;
/*
note:
-> you can filter vegan/vegetarian meals and hide salads (only LUH)
  by using the variables below

-> if you're vegeterian or vegan and the salad isn't shown,
  a medium sized widget is enough, otherwise you have to
  add a large one 

-> the widget is made for the Leibniz Universität in Hanover, but it also works
  for others. Please check GitHub for more information. (https://github.com/Linus-K/mensa-widget)
*/

mensaID = 6 

vegan = false
vegetarian = false

priceType = "students" //students, employees, others  

accentColor = Color.red()

showTomorrowAt = 18 //time from which on the menu of the next day is shown (in hours); change to 24 for midnight

hidden_categories = ["QUEERBEET"]


//beginnig of the code
const url = "https://openmensa.org/api/v2/canteens/" + mensaID + "/days/" + getIsoDate() + "/meals"

let widget = new ListWidget()

//get weekday as string 
let df = new DateFormatter()
df.dateFormat = 'EEEE'
let wd = df.string(nextWeekday())

//title
const head = widget.addStack()
head.layoutHorizontally()
head.setPadding(0, 0, 0, 0)

//Mensaplna-Label
title = head.addText("Mensaplan")
title.leftAlignText()
title.font = Font.boldRoundedSystemFont(16)

//Weekday-Label
const subHead = head.addStack()
subHead.setPadding(0, 4, 0, 0)

wd = subHead.addText(wd)
wd.leftAlignText()
wd.textColor = accentColor
wd.font = Font.regularRoundedSystemFont(16)

widget.addSpacer(12)

//load meals from API
meals = await new Request(url).loadJSON()

//the loop creates a new entry for every loaded meal
for (meal of meals) {

  mealIsVegan = meal.notes.includes("vegan")
  mealIsVegetarian = meal.notes.includes("vegetarisch") || mealIsVegan

  if ((mealIsVegan || !vegan) && (mealIsVegetarian || !vegetarian) && (!hidden_categories.includes(meal.category))) {
    label = widget.addText(meal.name)
    label.font = Font.regularSystemFont(12)

    label = widget.addText(meal.prices[priceType] + "€")
    label.rightAlignText()
    label.textColor = accentColor
    label.font = Font.boldSystemFont(10)
  }
}

widget.addSpacer()

widget.presentLarge()

Script.setWidget(widget)
Script.complete()

/**
 * the function returns the date of the next weekday
 * as a string in ISO 8601 format
 * @returns {String} - the date string
 */
function getIsoDate() {
  var dateTime = nextWeekday()

  let df = new DateFormatter()

  df.dateFormat = 'yyyy-MM-dd'
  df.locale = 'de'

  return df.string(dateTime)
}

/**
 * the function returns the date of the next weekday
 * @returns {Date} - next weekday's date
 */
function nextWeekday() {
  var date = new Date()
  
  if (date.getHours() >= showTomorrowAt) {
    date.setDate(date.getDate() + 1);
  }

  let df = new DateFormatter()
  df.dateFormat = 'EEEEE'
  var wd = df.string(date)

  while (wd == 'S') {
    date.setDate(date.getDate() + 1);
    wd = df.string(date);
  }

  return date
}
