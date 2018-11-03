document.addEventListener('DOMContentLoaded', () => {
    console.log('Add loaded')
    mixpanel.track('Site visit')

    const header = document.getElementById('header')
    
    const signInButton = document.getElementById('login-button')
    const signUpButton = document.getElementById('sign-up-button')
    const demoButton = document.getElementById('demo-button')

    const contactSignUpbutton = document.getElementById('contact-sign-up-button')
    const contactDemoButton = document.getElementById('contact-demo-button')

    const heroTitleSpan = document.getElementById('hero-title-span')

    signInButton.onclick = () => {
        window.location = 'login.html'
    }

    signUpButton.onclick = () => {
        window.location = 'register.html'
    }

    contactSignUpbutton.onclick = () => {
        window.location = 'register.html'
    }

    contactDemoButton.onclick = () => {
        window.location = 'register.html'
    }

    window.onscroll = (e) => {
        if ($(window).scrollTop() > 0) {
            header.style.backgroundColor = 'white'
            header.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)'
        } else {
            header.style.background = 'none'
            header.style.boxShadow = 'none'
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function makeID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 16; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    var typewriter = new Typewriter(heroTitleSpan, {
		loop: false,
        typingSpeed: 100
	})

    typewriter.typeString('Simplified.').start()
})