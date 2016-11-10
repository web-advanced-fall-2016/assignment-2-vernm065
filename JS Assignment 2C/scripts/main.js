/* eslint-env es6 */
(function() {
    let baseURL = 'http://148.75.251.185:8888';
    if (document.readyState != "loading") {
        app();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            app();
        }, false);
    }

    function getStudents() {
        let config = {
            method: 'GET',
            headers: new Headers({}),
        };

        let request = new Request(`${baseURL}/students`, config);
        fetch(request)
            .then(function(res) {
                if (res.status == 200)
                    return res.json();
                else
                    throw new Error('Something went wrong on api server!');
            })
            .then(function(res) {
                for (let student of res) {
                    let request = new Request(`${baseURL}/students/${student.id}`, config);
                    fetch(request)
                        .then(function(res) {
                            if (res.status == 200)
                                return res.json();
                            else
                                throw new Error('Something went wrong on api server!');
                        })
                        .then(function(res) {
                            populateStudent(res);
                        })
                        .catch(function(err) {
                            console.warn(`Couldn't fetch a student!`);
                            console.log(err);
                        });
                }
            })
            .catch(function(err) {
                console.warn(`Couldn't fetch students list`);
                console.log(err);
            });
    }

    function populateStudent(student) {
            let studentTemplate = document.createElement('div');
            studentTemplate.classList.add('person');
            studentTemplate.innerHTML = `
                                    <div class="thumb">
                                        <img src="${baseURL}${student.profile_picture}">
                                    </div>
                                    <div class="description">${student.excerpt}</div>
                                    <div class="info">
                                        <span>${student.first_name} <br> ${student.last_name} </span>
                                        <nav class="social">
                                        ${(links => {
                                            let result = '';
                                            for(let link of links){
                                                let icon = "";
                                                if( /github.com/.test(link.url) ){
                                                    icon = "svg/github.svg";
                                                }else if(/linkedin.com/.test(link.url) ){
                                                    icon = "svg/linkedin.svg";
                                                }else if (/instagram.com/.test(link.url) ){
                                                    icon = "svg/instagram.svg";
                                                }
                                                let linkTemplate = `<a href ="${link.url}"><img src = "${icon}"></a>`;
                                                result +=  linkTemplate;
                                            }
                                            return result;
                                        })(student.links)} 
                                        </nav> 
                                    </div>`;
            let mainWrapper = document.getElementById('main');
            mainWrapper.appendChild(studentTemplate);
        }

    function setupProfileSubmissionForm() {
        let profileSubmissionForm = document.querySelector('#profile-submission-form');
        let profileThumb = profileSubmissionForm.querySelector("#profile-picture");
        profileThumb.addEventListener('change', function(evnt) {
            let thumb = this.parentNode.querySelector('img');
            var file = this.files;

            function readAndPreview(file) {
                if (/\.(jpe?g|png)$/i.test(file.name)) {
                    var reader = new FileReader();
                    reader.addEventListener("load", function() {
                        thumb.title = file.name;
                        thumb.src = this.result;
                    }, false);
                    reader.readAsDataURL(file);
                }
            }
            if (file) {
                [].forEach.call(file, readAndPreview);
            }

        }, false);
        profileSubmissionForm.addEventListener('click', function(evnt) {
            let target = evnt.target || evnt.srcElement;
            if (target.classList.contains('add-more-links')) {
                if (target.classList.contains('btn-danger')) {
                    target.parentNode.remove(); // removing the whole link
                } else {

                    let newLink = target.parentNode.cloneNode(true);
                    target.parentNode.parentNode.appendChild(newLink);
                    target.classList.add('btn-danger');
                    target.classList.remove('btn-default');
                    target.innerText = '✘';

                }
            }

        }, false);

        profileSubmissionForm.addEventListener('submit', function(evnt) {
            evnt.preventDefault();
            let form = this;
            if (form.querySelector('.alert'))
                form.removeChild(form.querySelector('.alert'));

            var formData = new FormData(form);
            
            let config = {
                method: 'POST',
                headers: new Headers({}),
                body: formData
            };

            let request = new Request(`${baseURL}/students`, config);

            form.querySelector('fieldset').setAttribute('disabled', '');
            fetch(request)
                .then(function(res) {
                    if (res.status == 200)
                        return res.json();
                    else
                        throw new Error('Something went wrong on the fucking api server!');
                })
                .then(function(res) {
                    let successTemplate = document.createElement('template');
                    successTemplate.innerHTML = `<div class="alert alert-success" role="alert">
                                                            <strong>Dope!</strong> Your profile was saved!
                                                        </div>`;
                    let warningTemplate = document.createElement('template');
                    warningTemplate.innerHTML = `<div class="alert alert-warning" role="alert">
                                                            <strong>Hey!</strong>Your profile was updated! Why dontcha submit again to update it.
                                                        </div>`;

                    form.appendChild(successTemplate.content.firstChild);
                    form.querySelector('fieldset').removeAttribute('disabled');
                })
                .catch(function(err) {
                    let errorTemplate = document.createElement('template');
                    errorTemplate.innerHTML = `<div class="alert alert-danger" role="alert">
                                                        <strong>Dang!</strong> Couldn t save your profile!
                                                        </div>`;

                    form.appendChild(errorTemplate.content.firstChild);
                    form.querySelector('fieldset').removeAttribute('disabled');
                    console.log(err);
                });
        }, false);
    }


    function app() {
        getStudents();
        let modal = new SimpleModal('mymodal');
        setupProfileSubmissionForm();
    }
})();


var allPersonClass = document.getElementsByClassName('person');
var allDescriptionClass = document.getElementsByClassName('description');
console.log(allPersonClass.length);

for (var i = 0; i < allPersonClass.length; i++) {
    allPersonClass[i].addEventListener('mouseover', function(){
    // allDescriptionClass[i].style.color = 'red';
            
    event.preventDefault();
    });
};  