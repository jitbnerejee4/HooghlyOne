$(window).on('load', function(){
    $('.loader').fadeOut(3000);
    $('.container').fadeIn(3000);
})
$(document).ready(function(){ 
  $('#mytable').DataTable();
    var date_death=$('input[name="dateofdeath"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    date_death.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true
    })
    var date_birth=$('input[name="dateofbirth"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    date_birth.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true
    })
    $('#test').addClass('load')

    setTimeout(function() {
        $('#customNav').addClass('load')
    }, 3000);

    $(function(){
        $('#navbarDropdown').hover(function(){
            $('#dropdown-1').addClass('show')
        },
        function() {
            $('#dropdown-1').removeClass('show');
        });
    })
    $(function(){
        $('#dropdown-1').hover(function(){
            $(this).addClass('show');
        },
        function() {
            $(this).removeClass('show');
        })
    })
    $(function(){
        $('#navbarDropdown-2').hover(function(){
            $('#dropdown-2').addClass('show')
        },
        function() {
            $('#dropdown-2').removeClass('show');
        });
    })
    $(function(){
        $('#dropdown-2').hover(function(){
            $(this).addClass('show');
        },
        function() {
            $(this).removeClass('show');
        })
    })
    $(function(){
        $('#navbarDropdown-3').hover(function(){
            $('#dropdown-3').addClass('show')
        },
        function() {
            $('#dropdown-3').removeClass('show');
        });
    })
    $(function(){
        $('#dropdown-3').hover(function(){
            $(this).addClass('show');
        },
        function() {
            $(this).removeClass('show');
        })
    })
  // DISPLAY APPLICATIONS IN MY ACCOUNT
  let displayRest= false;
  let displayEighty= false;
  let displayEightyFive= false;
  let displayNinety= false;
  let displayHundred= false;
  let displayDeath= false;
  $('.app-display').click(function(){
    fetch("/dashboard/myaccount/ljkadkladklklawadadljkawlkjlkalkafllkaadlkkl", {
      method: "GET",         
      headers: { "Content-Type": "application/json"}
      })
      .then(response => response.json())
      .then((foundUser) =>{
        if(foundUser.restoration && !displayRest){
          $('#application-table').append(`<tr>
          <td class=value>${foundUser.restoration.ref}</td>
          <td class=value>${foundUser.restoration.application_type}</td>
          <td class=value>${foundUser.restoration.application_date}</td>
          <td class=value>${foundUser.restoration.status}</td>
          <td class=value>
            <form action= '/dashboard/myaccount/restoration/view/${foundUser.restoration._id}' method= "GET" target= "_blank">
              <button class= btn btn-success">View</button>
            </form>
          </td>
          </tr>`);
          displayRest= true;
        }
        if(foundUser.eightyYears && !displayEighty){
          $('#application-table').append(`<tr>
          <td class=value>${foundUser.eightyYears.ref}</td>
          <td class=value>${foundUser.eightyYears.application_type}</td>
          <td class=value>${foundUser.eightyYears.application_date}</td>
          <td class=value>${foundUser.eightyYears.status}</td>
          <td>
            <form action= '/dashboard/myaccount/eighty/view/${foundUser.eightyYears._id}' method= "GET" target= "_blank">
              <button class= btn btn-success">View</button>
            </form>
          </td>
          </tr>`);
          displayEighty= true;
        }
        if(foundUser.eightyFive && !displayEightyFive){
          $('#application-table').append(`<tr>
          <td class=value>${foundUser.eightyFive.ref}</td>
          <td class=value>${foundUser.eightyFive.application_type}</td>
          <td class=value>${foundUser.eightyFive.application_date}</td>
          <td class=value>${foundUser.eightyFive.status}</td>
          <td class=value>
            <form action= '/dashboard/myaccount/eightyfive/view/${foundUser.eightyFive._id}' method= "GET" target= "_blank">
              <button class= btn btn-success">View</button>
            </form>
          </td>
          </tr>`);
          displayEightyFive= true;
        }
        if(foundUser.ninety && !displayNinety){
          $('#application-table').append(`<tr>
          <td class=value>${foundUser.ninety.ref}</td>
          <td class=value>${foundUser.ninety.application_type}</td>
          <td class=value>${foundUser.ninety.application_date}</td>
          <td class=value>${foundUser.ninety.status}</td>
          <td class=value>
            <form action= '/dashboard/myaccount/ninety/view/${foundUser.ninety._id}' method= "GET" target= "_blank">
              <button class= btn btn-success">View</button>
            </form>
          </td>
          </tr>`);
          displayNinety= true;
        }
        if(foundUser.ninetyfive && !displayHundred){
          $('#application-table').append(`<tr>
          <td class=value>${foundUser.ninetyfive.ref}</td>
          <td class=value>${foundUser.ninetyfive.application_type}</td>
          <td class=value>${foundUser.ninetyfive.application_date}</td>
          <td class=value>${foundUser.ninetyfive.status}</td>
          <td class=value>
            <form action= '/dashboard/myaccount/hundred/view/${foundUser.ninetyfive._id}' method= "GET" target= "_blank">
              <button class= btn btn-success">View</button>
            </form>
          </td>
          </tr>`);
          displayHundred= true;
        }
        if(foundUser.deathintimation && !displayDeath){
          $('#application-table').append(`<tr>
          <td class=value>${foundUser.deathintimation.ref}</td>
          <td class=value>${foundUser.deathintimation.application_type}</td>
          <td class=value>${foundUser.deathintimation.application_date}</td>
          <td class=value>${foundUser.deathintimation.status}</td>
          <td class=value>
            <form action= '/dashboard/myaccount/deathintimation/view/${foundUser.deathintimation._id}' method= "GET" target= "_blank">
              <button class= btn btn-success">View</button>
            </form>
          </td>
          </tr>`);
          displayDeath= true;
        }
      })
  })
})

    // Client side form validation
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        }
      form.classList.add('was-validated')
    }, false)
})
// sidebar toggle
$('#menu-btn').click(function(){
    $('.sidebar').toggleClass("active");
})
$('.navbar-toggler').click(function(){
    $('#nav-bar').toggleClass("activate");
    $('#guestNavbar').toggleClass("activate");
})
// Password strength check 

$(function() {

    function passwordCheck(password) {
      if (password.length >= 8)
        strength += 1;
  
      if (password.match(/(?=.*[0-9])/))
        strength += 1;
  
      if (password.match(/(?=.*[!,%,&,@,#,$,^,*,?,_,~,<,>,])/))
        strength += 1;
  
      if (password.match(/(?=.*[a-z])/))
        strength += 1;
  
      if (password.match(/(?=.*[A-Z])/))
        strength += 1;
  
      displayBar(strength);
    }
  
    function displayBar(strength) {
      switch (strength) {
        case 1:
          $("#password-strength span").css({
            "width": "20%",
            "background": "#de1616"
          });
          break;
  
        case 2:
          $("#password-strength span").css({
            "width": "40%",
            "background": "#de1616"
          });
          break;
  
        case 3:
          $("#password-strength span").css({
            "width": "60%",
            "background": "#de1616"
          });
          break;
  
        case 4:
          $("#password-strength span").css({
            "width": "80%",
            "background": "#FFA200"
          });
          break;
  
        case 5:
          $("#password-strength span").css({
            "width": "100%",
            "background": "#06bf06"
          });
          break;
  
        default:
          $("#password-strength span").css({
            "width": "0",
            "background": "#de1616"
          });
      }
    }
  
    $("[data-strength]").after("<div id=\"password-strength\" class=\"strength\"><span></span></div>")
  
    $("[data-strength]").focus(function() {
      $("#password-strength").css({
        "height": "7px"
      });
    }).blur(function() {
      $("#password-strength").css({
        "height": "0px"
      });
    });
  
    $("[data-strength]").keyup(function() {
      strength = 0;
      var password = $(this).val();
      passwordCheck(password);
    });
    
});

// verify ID
let verify_flag = 0;
let val = 0;
$(".verify-btn").click(function(){
  $(".verify-msg").removeClass("dispMsg");
  verify_flag = 1;
  fetch("/verify-id", {
    method: "GET",         
    headers: { "Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then((datas) =>{
      let enteredId = Number($("#IdNo").val())  
      let match;
      if(enteredId === 0){
        $(':input[type="submit"]').prop('disabled', true);
        $(".invalid-msg").addClass("disp-invalid");
        $('.success-msg').removeClass('disp-success')
        $(".id-msg").removeClass("disp");
      }
      for(let data of datas){  
        if(enteredId === data.id){
          $(".id-msg").addClass("disp");
          $('.success-msg').removeClass('disp-success')
          $(".invalid-msg").removeClass("disp-invalid");
          $(':input[type="submit"]').prop('disabled', true);
          console.log(enteredId)
          console.log(data.id)
          match= true;
          break;
        }
      } 
      if(!match && enteredId !== 0){
        $('.success-msg').addClass('disp-success');
        $(".id-msg").removeClass("disp");
        $(".invalid-msg").removeClass("disp-invalid");
        val = $("#IdNo").val()
        $(':input[type="submit"]').prop('disabled', false);
      }
  })
})

$('.register-btn').click(function(){
  if(verify_flag === 0){
    $(this).prop('disabled', true);
    $(".verify-msg").addClass("dispMsg");
    $(".verify-btn").focus()
    $('.success-msg').removeClass('disp-success')
  }
  else if($("#IdNo").val()!= val){
    $(this).prop('disabled', true);
    $(".verify-msg").addClass("dispMsg");
    $('.success-msg').removeClass('disp-success')
  }else{
    $(this).prop('disabled', false);
    $(".verify-msg").removeClass("dispMsg");
  }
})

// MY ACCOUNT CARDS STYLING
$('.pass-display').click(function(){
  $('.password-card').addClass('card-display');
  $('.details-card').removeClass('card-display');
  $('.app-card').css("display", "none");
  $('.pass').css("background-color", "#2e7ae6");
  $('.account').css("background-color", "white");
  $('.app').css("background-color", "white");
})
$('.account-display').click(function(){
  $('.details-card').addClass('card-display');
  $('.password-card').removeClass('card-display');
  $('.app-card').css("display", "none");
  $('.account').css("background-color", "#2e7ae6");
  $('.pass').css("background-color", "white");
  $('.app').css("background-color", "white");
  
})
$('.app-display').click(function(){
  $('.app-card').css("display", "block");
  $('.password-card').removeClass('card-display');
  $('.details-card').removeClass('card-display');
  $('.app').css("background-color", "#2e7ae6");
  $('.pass').css("background-color", "white");
  $('.account').css("background-color", "white");
})

$('#profilePic').click(function() {
  $('#FileUpload1').trigger('click');
})
$('#FileUpload1').on('change', function(){
  $('.picForm').submit();
})





