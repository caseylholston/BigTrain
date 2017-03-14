  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCFpm0ZelOJm_Zzg5l_VDmQM9-uMTyckWU",
    authDomain: "big-train-firebase.firebaseapp.com",
    databaseURL: "https://big-train-firebase.firebaseio.com",
    storageBucket: "big-train-firebase.appspot.com",
    messagingSenderId: "392087168892"
  };
  firebase.initializeApp(config);

  //to empty all fields after submit
  function resetForm(){
    $('#trainForm')[0].reset();  
}
  //init database firebase
  var database = firebase.database();

 
  $("#addTrain").on("click", function(event) {
    //alert("inside submit");
    event.preventDefault();
    var trainName = $('#trainName').val().trim();
    var trainDestination = $('#trainDestination').val().trim();
    var firstDeparture = $('#firstDeparture').val().trim();
    var tripTime = $('#tripTime').val().trim();

    //save into firebase
    database.ref().push({
      trainName : trainName,
      trainDestination : trainDestination,
      firstDeparture : firstDeparture,
      tripTime : tripTime,
      dateAdded : firebase.database.ServerValue.TIMESTAMP
    //end firebase call
    });
    //need to empty all fields after submit
    resetForm();
  //End form on click event
  });
  //retrieve values from database
  database.ref().on("child_added", function(childSnapshot){
    var obj = childSnapshot.val();
    var nextArrival = moment().diff(moment(obj.startDate), "months");
    var minutesAway = months * obj.monthlyRate;
    console.log(nextArrival);
    console.log(minutesAway);

  $('#trainTable tr:last').after('<tr><td>'+ obj.trainName +
                                 '</td><td>'+ obj.trainDestination +
                                 '</td><td>'+ obj.tripTime +
                                 '</td><td>'+ nextArrival +
                                 '</td><td>'+ minutesAway);



  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  }
  //End on child added function
  );



