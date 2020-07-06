function signup(e) {
    e.preventDefault();
    const signupForm = document.getElementById("signup-form");
    const email = signupForm['email'].value;
    const password = signupForm["password"].value;

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        signupForm.reset();
        window.location.href = "index.html";
        /*
        return cred.user.updateProfile({
            displayName: signupForm['username'].value
        })
        
    }).then(() => {
        console.log(auth.currentUser.displayName);*/
    })

}

// create days and years
function dobSelect(){
    const daySelect = document.getElementById('day');
    const yearSelect = document.getElementById('year');
    for (var i = 1; i <= 31; i++){
        // appending options to month
        daySelect.appendChild(createOptionValues("day", i));
    }
    for(var i = 2020; i>= 1900; i--){
        yearSelect.appendChild(createOptionValues("year",i));
    }
}

function createOptionValues(type, num){
    const optionEl = document.createElement('option');
    optionEl.value = type+num.toString();
    optionEl.innerHTML = num.toString();
    optionEl.id = type+num.toString();
    optionEl.className = "roboto xs"
    return optionEl;
}