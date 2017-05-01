var viewport = document.getElementById('viewport');
var buttonTray = document.getElementById('buttonTray');

function setCalTo (mm, yyyy) {
  var currMonthDeeds = getMonthDetails(mm, yyyy);
  document.getElementById('classes_calendar_month').innerHTML = currMonthDeeds[0];
  var dates = document.getElementById('classes_calendar_dates');
  dates.innerHTML = "";
  var doc = document;
  var date_length = currMonthDeeds[1] + currMonthDeeds[2];
  if (currMonthDeeds[2] === 0) {
    currMonthDeeds[2] = 7;
  }
  var tr = doc.createElement('tr');
  var flag = true;
  for (var i = 1; i < date_length; i++) {
    var td = doc.createElement('td');
    if ((i - currMonthDeeds[2] + 1) > 0) {
      td.innerHTML = (i - currMonthDeeds[2] + 1);
      var inp = doc.createElement('input');
      inp.type = "hidden";
      var dd__ = (i - currMonthDeeds[2] + 1);
      if (dd__ < 10) {
        dd__ = "0" + dd__;
      }
      else {
        dd__ = "" + dd__;
      }
      inp.value = currMonthDeeds[3] + "-" + currMonthDeeds[4] + "-" + dd__;
      td.appendChild(inp);
      td.addEventListener('click', function () {
        if (this.className !== "selected") {
          selectDate(this);
        }
      }, false);
      if (flag) {
        selectDate(td);
        flag = false;
      }
    }
    else {
      td.innerHTML = "--";
    }
    tr.appendChild(td);
    if (i % 7 === 0) {
      dates.appendChild(tr);
      tr = doc.createElement('tr');
    }
  }
  dates.appendChild(tr);
};
function getMonthDetails (month, year) {
  var details = [];
  var m = 0;
  switch (month) {
    case 0:
      details = ["January, " + year, 31];
      m = 11;
      break;
    case 1:
      if (year % 4 === 0) {
        details = ["Febuary, " + year, 29];
      }
      else {
        details = ["Febuary, " + year, 28];
      }
      m = 12;
      break;
    case 2:
      details = ["March, " + year, 31];
      m = 1;
      break;
    case 3:
      details = ["April, " + year, 30];
      m = 2;
      break;
    case 4:
      details = ["May, " + year, 31];
      m = 3;
      break;
    case 5:
      details = ["June, " + year, 30];
      m = 4;
      break;
    case 6:
      details = ["July, " + year, 31];
      m = 5;
      break;
    case 7:
      details = ["August, " + year, 31];
      m = 6;
      break;
    case 8:
      details = ["September, " + year, 30];
      m = 7;
      break;
    case 9:
      details = ["October, " + year, 31];
      m = 8;
      break;
    case 10:
      details = ["November, " + year, 30];
      m = 9;
      break;
    case 11:
      details = ["Decemeber, " + year, 31];
      m = 10;
      break;
  }
  var _year = "" + year;
  _year.split('');
  var _D = parseInt(_year[2] + _year[3]);
  var _C = parseInt(_year[0] + _year[1]);
  day = 1 + Math.floor(((13 * m) - 1) / 5) + _D + Math.floor(_D / 4) + Math.floor(_C / 4) - 2 * _C;
  if (day < 0) {
    day = (day % 7) + 7;
  }
  else {
    day = day % 7;
  }
  details.push(day);
  details.push(year);
  var month_ =  month + 1;
  if (month_ < 10) {
    month_ = "0" + month_;
  }
  else {
    month_ += "";
  }
  details.push(month_);
  return details;
};
function selectDate (obj) {
  if (currSelection !== undefined) {
    currSelection.className = "";
  }
  obj.className = "selected";
  currSelection = obj;
  updateClasses(obj.querySelector("input[type=hidden]").value, document.getElementById('year_years_selection').value, document.getElementById('batch_batches_selection').value);
};
function updateClasses (date, year, batch) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else {
    // code for older browsers
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var dayClasses = JSON.parse(this.responseText);
      var dayClasses_length = dayClasses.length;
      var doc = document;
      var container = document.getElementById('classes_datedList');
      container.innerHTML = "";
      for (var i = 0; i < dayClasses_length; i++) {
        var ele = doc.createElement('div');
        var txt = '<div><h2>CLASS_NAME</h2><p>START_TIME - END_TIME</p><span>DATE</span><div>DEPT</div><div class="validation"></div></div><div><img src="/static/checkbox-unchecked.png"/><input type="hidden"/></div>';
        txt = txt.replace('CLASS_NAME', dayClasses[i].name);
        txt = txt.replace('START_TIME', dayClasses[i].start_time);
        txt = txt.replace('END_TIME', dayClasses[i].end_time);
        txt = txt.replace('DATE', dayClasses[i].date);
        if (dayClasses[i].department instanceof Array) {
          var dpt_txt = "<select><option>Select the department</option><option>" + dayClasses[i].department.join("</option><option>") + "</option></select>";
          txt = txt.replace('DEPT', dpt_txt);
        }
        else {
          txt = txt.replace('DEPT', '');
        }
        ele.innerHTML = txt;
        ele.querySelector('input[type=hidden]').value = JSON.stringify(dayClasses[i]);
        ele.querySelector('div:nth-child(2)').addEventListener('click', function () {
          if (this.parentNode.parentNode.id === "classes_datedList") {
              if (this.parentNode.querySelector("select")) {
              if (this.parentNode.querySelector("select").value !== "Select the department") {
                var dayClass = JSON.parse(this.parentNode.querySelector('input[type=hidden]').value);
                if (dayClass.department.indexOf(this.parentNode.querySelector("select").value) > -1) {
                  this.parentNode.querySelector('.validation').innerHTML = "";
                  addToSelectedClasses(this.parentNode);
                }
              }
              else {
                // FORM VALIDATION
                this.parentNode.querySelector('.validation').innerHTML = "Please select the department.";
              }
            }
            else {
              addToSelectedClasses(this.parentNode);
            }
          }
        }, false);
        var selectedClasses = document.getElementById('classes_selection_selection').childNodes;
        var selectedClasses_length = selectedClasses.length;
        var id = dayClasses[i].id;
        var date = dayClasses[i].date;
        for (var j = 0; j < selectedClasses_length; j++) {
          var selectedClass = JSON.parse(selectedClasses[j].querySelector('input[type=hidden]').value);
          if (selectedClass.id === id && selectedClass.date === date) {
            ele.style.display = "none";
          }
        }
        container.appendChild(ele);
      }
    }
  };
  xhttp.open("GET", "/classdata?date=" + date + "&batch=" + year + "+Year+Batch+" + batch, true);
  xhttp.send();
  document.getElementById('classes_otherClasses').className = "noshow";
  document.getElementById('classes_otherClasses_date').innerHTML = date;
  document.getElementById('classes_otherClasses_name').value = "";
  document.getElementById('classes_otherClasses_startTime').value = "";
  document.getElementById('classes_otherClasses_endTime').value = "";
  document.getElementById('classes_otherClasses_depts').value = "Select the department";
  document.getElementById('classes_otherClasses_validation').innerHTML = "";
}
function addToSelectedClasses (node) {
  var node_ = node.cloneNode(true);
  if (node.querySelector("select")) {
    var sel = node_.querySelector("select");
    sel.value = node.querySelector("select").value;
    sel.parentNode.innerHTML = "<div>" + sel.value + "</div>";
    var selectedClass_ = JSON.parse(node_.querySelector('input[type=hidden]').value);
    selectedClass_.department =  node.querySelector("select").value;
    node_.querySelector('input[type=hidden]').value = JSON.stringify(selectedClass_);
  }
  node_.querySelector('div:nth-child(2) > img').addEventListener('click', function () {
    var searchEles = document.getElementById('classes_datedList').childNodes;
    var searchEles_length = searchEles.length;
    var this_ = JSON.parse(this.parentNode.querySelector('input[type=hidden]').value);
    for (var i = 0; i < searchEles_length; i++) {
      searchEle = JSON.parse(searchEles[i].querySelector('input[type=hidden]').value);
      if (searchEle.id === this_.id && searchEle.date === this_.date) {
        searchEles[i].style.display = "table";
      }
    }
    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
  }, false);
  node_.querySelector('div:nth-child(2) > img').src = "/static/checkbox-checked.png";
  document.getElementById('classes_selection_selection').appendChild(node_);
  node.style.display = "none";
};
function harvest () {
  var details = {};
  details.name = "" + document.getElementById('name_text').value;
  details.email = "" + document.getElementById('email_email').value;
  details.rollNumber = "" + document.getElementById('number_number').value;
  details.serialNumber = "" + document.getElementById('serialNumber_number').value;
  details.year = "" + document.getElementById('year_years_selection').value;
  details.batch = "" + document.getElementById('batch_batches_selection').value;
  var selected = [];
  var selectedEles = document.getElementById('classes_selection_selection').childNodes;
  var selectedEles_length = selectedEles.length;
  for (var i = 0; i < selectedEles_length; i++) {
    selected.push(JSON.parse(selectedEles[i].querySelector('input[type=hidden]').value));
  }
  details.selectedClasses = selected;
  details.event = "" + document.getElementById('events_text').value;
  // validation
  document.getElementById('name_validation').innerHTML = "";
  document.getElementById('email_validation').innerHTML = "";
  document.getElementById('number_validation').innerHTML = "";
  document.getElementById('serialNumber_validation').innerHTML = "";
  document.getElementById('classes_validation').innerHTML = ""
  document.getElementById('events_validation').innerHTML = "";
  var flag = true;
  if (!(/^\w[\w\s!]*/.test(details.name))) {
    flag = false;
    document.getElementById('name_validation').innerHTML = "Invalid Name.";
  }
  if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(details.email))) {
    flag = false;
    document.getElementById('email_validation').innerHTML = "Invalid Email.";
  }
  if (!(/^\d{9,}/.test(details.rollNumber))) {
    flag = false;
    document.getElementById('number_validation').innerHTML = "Invalid Roll Number.";
  }
  if (!(/^\d+/.test(details.serialNumber))) {
    flag = false;
    document.getElementById('serialNumber_validation').innerHTML = "Invalid Serial Number.";
  }
  if (details.selectedClasses.length === 0) {
    flag = false;
    document.getElementById('classes_validation').innerHTML = "Please select the classes you have missed."
  }
  if (!(/^\w[\w\s]*/.test(details.event))) {
    flag = false;
    document.getElementById('events_validation').innerHTML = "Invalid Event Name.";
  }
  if (flag === true) {
    return details;
  }
  else {
    return false;
  }
};
function sendReq () {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", '/classdata');
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var lst = JSON.parse(this.responseText);
      document.getElementById('download_link').href = "/download?ids=" + lst.join(',');
      document.getElementById('download').style.display = "inline";
    }
  };
  if (harvest()) {
    xmlhttp.send(JSON.stringify(harvest()));
    return true;
  }
  else {
    return false;
  }
};

document.getElementById('classes_calendar_prev').addEventListener('click', function () {
  mm--;
  if (mm < 0) {
    mm = 11;
    yyyy--;
  }
  setCalTo(mm, yyyy);
}, false);
document.getElementById('classes_calendar_next').addEventListener('click', function () {
  mm++;
  if (mm >= 11) {
    mm = 0;
    yyyy++;
  }
  setCalTo(mm, yyyy);
}, false);
document.getElementById('buttonTray_next').addEventListener('click', function () {
  /*var pages = [
    'name',
    'email',
    'number',
    'serialNumber',
    'year',
    'batch',
    'classes',
    'events'
  ];
  var pages_length = pages.length;
  for (var i = 0; i < pages_length; i++) {
    var ele = document.getElementById('' + pages[i]);
    // validation
    if (ele.className !== 'show') {
      ele.className = 'show';
      return false;
    }
  }*/
  if (sendReq() !== false) {
    document.getElementById('buttonTray').parentNode.removeChild(document.getElementById('buttonTray'));
    document.getElementById('thankyou').className = "show";
  }
}, false);
document.getElementById('classes_otherClasses').addEventListener('click', function () {
  if (this.className === 'noshow') {
    this.className = "";
  }
}, false);
document.getElementById('classes_otherClasses_submit').addEventListener('click', function () {
  // collect
  var name = document.getElementById('classes_otherClasses_name').value;
  var startTime = document.getElementById('classes_otherClasses_startTime').value;
  var endTime = document.getElementById('classes_otherClasses_endTime').value;
  var dept = document.getElementById('classes_otherClasses_depts').value;
  var date = document.getElementById('classes_otherClasses_date').textContent;
  // validate
  var flag = true;
  if (!(/^\w[\s\w\/]*$/.test(name))) {
    flag = false;
    document.getElementById('classes_otherClasses_validation').innerHTML = "Please check the name of the class.";
  }
  if (!(/^\d\d\:\d\d$/.test(startTime))) {
    flag = false;
    document.getElementById('classes_otherClasses_validation').innerHTML = "Please check the start time.";
  }
  else {
    var matches = /^(\d\d)\:(\d\d)$/.exec(startTime);
    var hours = Number(matches[1]);
    var minutes = Number(matches[2]);
    var meridian = "";
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    }
    else {
      meridian = "AM";
    }
    if (hours == 0) {
      hours = 12;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    startTime = "" + hours + ":" + minutes + " " + meridian;
  }
  if (!(/^\d\d\:\d\d$/.test(endTime))) {
    flag = false;
    document.getElementById('classes_otherClasses_validation').innerHTML = "Please check the end time.";
  }
  else {
    var matches = /^(\d\d)\:(\d\d)$/.exec(endTime);
    var hours = Number(matches[1]);
    var minutes = Number(matches[2]);
    var meridian = "";
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    }
    else {
      meridian = "AM";
    }
    if (hours == 0) {
      hours = 12;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    endTime = "" + hours + ":" + minutes + " " + meridian;
  }
  if (dept === "Select the department") {
    flag = false;
    document.getElementById('classes_otherClasses_validation').innerHTML = "Please select a department.";
  }
  if (flag) {
    // create a node
    var ele = document.createElement('div');
    var innerHTML_txt = '<div><h2>CLASS_NAME</h2><p>START_TIME - END_TIME</p><span>DATE</span><div>DEPT</div></div><div><img src="/static/checkbox-checked.png"/><input type="hidden"/></div>';
    innerHTML_txt =  innerHTML_txt.replace('CLASS_NAME', name);
    innerHTML_txt =  innerHTML_txt.replace('START_TIME', startTime);
    innerHTML_txt = innerHTML_txt.replace('END_TIME', endTime);
    innerHTML_txt = innerHTML_txt.replace('DATE', date);
    innerHTML_txt = innerHTML_txt.replace('DEPT', dept);
    ele.innerHTML = innerHTML_txt;
    ele.querySelector('input[type=hidden]').value = JSON.stringify({
      date: date,
      name: name,
      start_time: startTime,
      end_time: endTime,
      department: dept
    });
    ele.querySelector('img').addEventListener('click', function () {
      this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }, false);
    // append to selectedClasses
    document.getElementById('classes_selection_selection').appendChild(ele);
    // clear values
    document.getElementById('classes_otherClasses_name').value = "";
    document.getElementById('classes_otherClasses_startTime').value = "";
    document.getElementById('classes_otherClasses_endTime').value = "";
    document.getElementById('classes_otherClasses_depts').value = "Select the department";
    document.getElementById('classes_otherClasses_validation').innerHTML = "";
  }
}, false);

var eles = document.querySelectorAll('.radio');
var eles_length = eles.length;
for (var i = 0; i < eles_length; i++) {
  var eles_divs = eles[i].querySelectorAll('div');
  var eles_divs_length = eles_divs.length;
  var flag = true;
  for (var j = 0; j < eles_divs_length; j++) {
    if (flag) {
      eles_divs[j].parentNode.querySelector('input').value = eles_divs[j].textContent;
      eles_divs[j].className = 'selected';
      flag = false;
    }
    eles_divs[j].addEventListener('click', function () {
      this.parentNode.querySelector('input').value = this.textContent;
      this.parentNode.querySelector('.selected').className = '';
      this.className = 'selected';
      updateClasses(document.getElementById("classes_calendar_dates").querySelector("td.selected").querySelector("input[type=hidden]").value, document.getElementById('year_years_selection').value, document.getElementById('batch_batches_selection').value);
    }, false);
  }
}

var d = new Date();
var mm = d.getMonth();
var yyyy = d.getFullYear();
var currSelection;
setCalTo(mm, yyyy);
