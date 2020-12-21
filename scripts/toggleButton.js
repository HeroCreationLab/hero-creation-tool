function openTab(evt, className) {
    console.log(evt)
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(className).style.display = "block";
    evt.currentTarget.className += " active";
}

function openSelector(evt) {
  selector = document.getElementById("equip-select");
  selectedValue = selector.selectedIndex;

  if (selectedValue == 2) {
    $('#class-equip').css("display", "none")
    $('#gold-equip').css("display", "inline-block")
  } else if (selectedValue == 1) {
    $('#class-equip').css("display", "inline-block")
    $('#gold-equip').css("display", "none")
  } else {
    $('#class-equip').css("display", "none")
    $('#gold-equip').css("display", "none")
  }
}
