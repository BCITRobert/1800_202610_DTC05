function navToLogin() {
    window.location.href = "login.html"
}

function Signup() {
    $("#loginView").addClass("hidden")
    $("#signupView").removeClass("hidden")
}


function setup() {
    $(document).on("click", "#goToLogin", navToLogin)
    $(document).on("click", "#toSignup", Signup)
}
$(document).ready(setup)