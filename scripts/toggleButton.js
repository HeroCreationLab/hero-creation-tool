<<<<<<< HEAD
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

$(document).ready(function(){
  $("#startButton").click(function(){
    not$("#startDiv").hide();
    ("#startDiv").show();
  });
  $("#raceButton").click(function(){
    not$("#raceDiv").hide();
    ("#raceDiv").show();
  });
  $("#classButton").click(function(){
    not$("#classDiv").hide();
    ("#classDiv").show();
  });
  $("#abButtons").click(function(){
    not$("#abDiv").hide();
    ("#abDiv").show();
  });
  $("#backgroundButton").click(function(){
    not$("#backgroundDiv").hide();
    ("#backgroundDiv").show();
  });
  $("#eqButton").click(function(){
    not$("#eqDiv").hide();
    ("#eqDiv").show();
  });
  $("#spButton").click(function(){
    not$("#spDiv").hide();
    ("#spDiv").show();
  });
  $("#featsButton").click(function(){
    not$("#featsDiv").hide();
    ("#featsDiv").show();
  });
  $("#bioButton").click(function(){
    not$("#bioDiv").hide();
    ("#bioDiv").show();
  });
  $("#reviewButton").click(function(){
    not$("#reviewDiv").hide();
    ("#reviewDiv").show();
  });
  $("#tabs").show();
});
=======
function openTab(evt, className) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      console.log(tablinks[i]);
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(className).style.display = "block";
    evt.currentTarget.className += " active";
    console.log(evt);
}

module.exports.openTab = openTab;
>>>>>>> 626a1c82851846dab7ab102463a26839f1efb089
