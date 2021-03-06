//login using username/email and password
function login(e) {
    e.preventDefault();
    var valid = false;
    const loginForm = document.getElementById("login-form");
    const user = loginForm['username'].value;
    const password = loginForm['password'].value;

    auth.signInWithEmailAndPassword(user, password).then(cred => {
        valid = true;
        loginForm.querySelector("#error").innerHTML = "";
        window.location.replace("index.html");
    }).catch(() => {
        // check if user used username to login
        return db.collection('user-info').get().then(snapshot => {
            snapshot.forEach(doc => {
                const userInfo = doc.data();
                if (userInfo.username == user) {
                    valid = true;
                    auth.signInWithEmailAndPassword(userInfo.email, password).then(() => {
                        window.location.replace("index.html");
                        return false;
                    }).catch(() => {
                        //incorrect password
                        loginForm.querySelector("#error").innerHTML = "Invalid username/email or password.";
                    })
                }
            })
        })
    }).then(() => {
        if (valid == false){
            loginForm.querySelector("#error").innerHTML = "Invalid username/email or password.";

        }
    })
}

//signing up while also making sure there are no duplicate usernames/emails
function signup(e) {
    e.preventDefault();
    var valid = true;
    const signupForm = document.getElementById("signup-form");
    const username = signupForm['username'].value
    const email = signupForm['email'].value;
    const password = signupForm["password"].value;
    const copassword = signupForm["copassword"].value;
    const month = signupForm['month'].value;
    const day = signupForm['day'].value;
    const year = signupForm['year'].value;

    signupForm.querySelector("#username-error").innerHTML ='';
    signupForm.querySelector("#password-error").innerHTML ='';
    signupForm.querySelector("#email-error").innerHTML ='';
    signupForm.querySelector("#birthday-error").innerHTML = '';

    //check to see if passwords match
    if (copassword != password) {
        signupForm.querySelector("#password-error").innerHTML = "Passwords do not match.";
        valid = false;
    } 

    if ((month == "Month" || day == "Day") || year == "Year"){
        signupForm.querySelector("#birthday-error").innerHTML = "Please enter your birthday.";
        valid = false;
    }

    if(valid == true){
        db.collection('user-info').where('username', '==', username).get().then(snapshot => {
            if(snapshot.empty) {
                return auth.createUserWithEmailAndPassword(email, password);
            } else {
                signupForm.querySelector("#username-error").innerHTML = "Username taken.";
                return false;
                //valid = false;
            } 
        }).then(cred => {
            console.log(cred);
            //Create the user doc in the users collection
            db.collection('profile').doc(cred.user.uid).set({
                username: username,
                firstName: signupForm['firstName'].value.toLowerCase(),
                lastName: signupForm['lastName'].value.toLowerCase(),
                name: signupForm['firstName'].value+" "+signupForm['lastName'].value,
                about: "",
                title: "",
                location: "",
                goals: ["Ask a question", "Find a mentor or mentee"],
                finished: ["Join coffee pod!"],
                tags: [],
                tagSize: 0,
                following: []
            });
            db.collection('notifications').doc(cred.user.uid).set ({
                menteeRequests: [],
                mentorRequests: []
            });
            return db.collection('user-info').doc(cred.user.uid).set({
                username: username,
                email: email,
                name: signupForm['firstName'].value+" "+signupForm['lastName'].value,
                dob: month+" "+day+", "+year,
                // store the ids for the mentors and mentees user info so we can find it
                mentors: [],
                mentees: [],
                mentorOfPairs: [],
                menteeOfPairs: [],
                chats: []
            }).then(() => {
                window.location.replace("index.html");
            })
        }).catch(err => {
            signupForm.querySelector("#system-error").innerHTML = err;
            valid = false;
        });
    }
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
    optionEl.value = num.toString();
    optionEl.innerHTML = num.toString();
    optionEl.id = type+num.toString();
    optionEl.className = "roboto xs"
    return optionEl;
}