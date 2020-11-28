


// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode'); 

const darkModeToggle = document.querySelector('#dark-mode-toggle');

const enableDarkMode = () => {
  localStorage.setItem('darkMode', 'enabled');  


  var element = document.body;
  element.classList.add("dark-mode");
  element.classList.add("text-white");

  var element = document.querySelectorAll("#navbar");
  element.forEach(element=>{
    element.classList.toggle("navbar-light");
    element.classList.toggle("navbar-dark");
  })
  
  var element = document.querySelectorAll("#hideinwhite");
    element.forEach(element=>{
    element.classList.add('d-block');
  })

  var element = document.querySelectorAll("#whiteindark");
  element.forEach(element=>{
    element.classList.add('text-white');
  })
  
  var element = document.querySelectorAll("#tabledark");
   element.forEach(element=>{
    element.classList.add('table-dark');
  })


  // var element = document.querySelectorAll("#whiteindark");
  // element.classList.add('text-white');

  // var element = document.querySelectorAll("#blackinwhite");
  // element.classList.add('text-white');


  
 
  
}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  // 2. Update darkMode in localStorage 
  localStorage.setItem('darkMode', null);

  var element = document.body;
  element.classList.remove("dark-mode");
  element.classList.remove("text-white");



  var element = document.querySelectorAll("#navbar");
  element.forEach(element=>{
    element.classList.toggle("navbar-light");
    element.classList.toggle("navbar-dark");
  })

  var element = document.querySelectorAll("#hideinwhite");
    element.forEach(element=>{
    element.classList.remove('d-block');
  })

  var element = document.querySelectorAll("#whiteindark");
  element.forEach(element=>{
    element.classList.remove('text-white');
  })

  var element = document.querySelectorAll("#tabledark");
  element.forEach(element=>{
    element.classList.remove('table-dark');
  })

  // var element = document.querySelectorAll("#whiteindark");
  // element.classList.remove('text-white');
  
  // var element = document.querySelectorAll("#blackinwhite");
  // element.classList.remove('text-white');


}
 
// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
  enableDarkMode();
}

// When someone clicks the button
darkModeToggle.addEventListener('click', () => {
  // get their darkMode setting
  darkMode = localStorage.getItem('darkMode'); 
  
  // if it not current enabled, enable it
  if (darkMode !== 'enabled') {
    enableDarkMode();
  // if it has been enabled, turn it off  
  } else {  
    disableDarkMode(); 
  }
});



$(document).ready(function(){
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});

})

$('#password, #confirm_password').on('keyup', function () {
  if ($('#password').val() == $('#confirm_password').val()) {
    $('#message').html('Matching').css('color', 'green');
  } else 
    $('#message').html('Not Matching').css('color', 'red');
});
