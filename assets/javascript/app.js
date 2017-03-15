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
  function doEmpty(){
    $('#trainForm')[0].reset();  
  };
  //create a database variable for Firebase
  var database = firebase.database();
 //on click event for a train being added
  $(document).on('click','#addTrain', function(event) {
    console.log("clicked");
    event.preventDefault();
    var trainName = $('#trainName').val().trim();
    var trainDestination = $('#trainDestination').val().trim();
    var firstDeparture = $('#firstDeparture').val().trim();
    var tripTime = $('#tripTime').val().trim();
    //console.log(trainName + trainDestination + firstDeparture + tripTime);

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
    doEmpty();
  //End form on click event
  });
  //retrieve values from database
  database.ref().on("child_added", function(childSnapshot){
    var obj = childSnapshot.val();
    //set a variable the current time
    var currentTime = moment();
    var convertedFirstDeparture = moment(obj.firstDeparture, 'HH:mm').subtract(1, 'years');
      //console.log(convertedFirstDeparture);
    var elapsedTime = currentTime.diff(moment(convertedFirstDeparture), "minutes")
      //console.log('Elapsed Time ' + moment(elapsedTime).format('HH:mm'));
    var remainderMinutes = (elapsedTime % obj.tripTime);
      //console.log('Remainder Minutes ' + remainderMinutes);
    var minutesAway = (obj.tripTime - remainderMinutes);
      //console.log('Minutes Away ' + minutesAway);
    var nextTrain = moment().add(minutesAway, "minutes");
      //console.log('Next Arrival ' + nextTrain);
    var nextArrival = (moment(nextTrain).format('HH:mm'));


  $('#trainTable tr:last').after('<tr><td>'+ obj.trainName +
                                 '</td><td>'+ obj.trainDestination +
                                 '</td><td>'+ obj.tripTime +
                                 '</td><td>'+ nextArrival +
                                 '</td><td>'+ minutesAway);
  }, 
  //error checking
  function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  }
  //End on child added function
  );