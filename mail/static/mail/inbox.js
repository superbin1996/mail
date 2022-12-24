// // When back arrow is clicked, show previous section
// window.onpopstate = function(event) {
//   console.log(event.state.mailbox);
//   load_mailbox(mailbox);
// }

document.addEventListener('DOMContentLoaded', function() {
  console.log('page load');
  
  
  // By default, load the inbox
  load_mailbox('inbox')
  
  // window.onload = function() {
  //   var reloading = sessionStorage.getItem("reloading");
  //   if (reloading) {
  //     console.log('reload')
  //     sessionStorage.removeItem("reloading");
  //     sent.click();
  //     // return false;
  //   }
  // }

  inbox = document.querySelector('#inbox');
  sent = document.querySelector('#sent');
  archive = document.querySelector('#archived');
  compose = document.querySelector('#compose');

  // // Add data-= attribute 
  // inbox.setAttribute('data-mailbox', 'inbox');
  // sent.setAttribute('data-mailbox', 'sent');
  // compose.setAttribute('data-mailbox', 'compose');
  // archive.setAttribute('data-mailbox', 'archive');

  // // Add the current state to show url
  // document.querySelectorAll('#btn-outline-primary').forEach(function(element) { 
  //   element.onclick = function() {
  //     const mailbox = this.dataset.mailbox;
  //     history.pushState({mailbox: mailbox}, "", `${mailbox}`);
  //   };
  // });
  
  
  // Use buttons to toggle between views
  inbox.addEventListener('click', function() {
    load_mailbox('inbox');
  });
  sent.addEventListener('click', function() {
    // console.log(event);
    load_mailbox('sent');
  });
  archive.addEventListener('click', function() {
    load_mailbox('archive');
  });
  
  // Send mail in compose-mail
  compose.addEventListener('click', function() {
    compose_email();
  });

  document.querySelector('.btn-primary').onclick = function() {
    send();
    // reloadPage();
    return false;
  }

});

// Reload page after send mail 
// function reloadPage() {
//   sessionStorage.setItem("reloading", "true");
  // document.location.reload();
// }

// When click on compose button 
function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// Send after composing 
function send() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  
  // Send data to views.py then get back response 
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log('send');
    if (result.message) {
      // window.alert(result.message);
      console.log(`Message: ${result.message}`);
    }
    else {
      // window.alert(result.error);
      console.log(`Error: ${result.error}`);
    }
  })
  .then(() => {
    load_mailbox('sent');
  })

}

// Show Inbox/Compose/Sent/Archived
function load_mailbox(mailbox) {
  console.log(`${mailbox}`);
  load_mail(mailbox);

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Remove all of children element
  document.querySelector('#emails-view').replaceChildren();

  // Show the mailbox name. Replace the first letter with a Capital letter
  document.querySelector('#emails-view').innerHTML = `<h3 id='mailbox'>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.querySelector('#mailbox').style.paddingBottom = '1rem';
  
}

// Go to views.py and get inbox emails data 
function load_mail(mailbox) {
  // console.log(`load_mail have run`)
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    // ... do something else with emails ...
    for (let email of emails) {
      let subjectTd = document.createElement('td');
      subjectTd.setAttribute('id', 'subject');
      subjectTd.setAttribute('style', 'text-overflow: ellipsis; width: 720px');
      subjectTd.innerHTML = email.subject; 
      
      let senderTd = document.createElement('td');
      senderTd.setAttribute('id', 'sender');
      senderTd.setAttribute('style', 'text-overflow: ellipsis; width: 50px; padding-right: 30px');
      senderTd.innerHTML = email.sender;
      
      let toTd = document.createElement('td');
      toTd.style.width = '30px';
      toTd.innerHTML = 'to';
      
      // Get key array of object elements of recipients array of emails object
      let recipientShortenArray = [];
      // let recipientArray = [];
      const keyArray = Object.keys(email.recipients);
      for (let key of keyArray) {
        // Get recipients addresses without @... part
        recipientShortenArray.push(email.recipients[key].split("@", 1));
        
        // Get full address name of recipients 
        // recipientArray.push(email.recipients[key]);
      }
    
      let recipientShortenTd = document.createElement('td');
      recipientShortenTd.setAttribute('id', 'recipientShorten');
      recipientShortenTd.setAttribute('style', 'text-overflow: ellipsis; width: 180px;');
      recipientShortenTd.innerHTML = recipientShortenArray.toString();
      
      // let recipientTd = document.createElement('td');
      // recipientTd.setAttribute('id', 'recipient');
      // recipientTd.setAttribute('style', 'text-overflow: ellipsis; display: none');
      // recipientTd.innerHTML = recipientArray;
      
      // let bodyTd = document.createElement('td');
      // bodyTd.setAttribute('id', 'body');
      // bodyTd.setAttribute('style', 'text-overflow: ellipsis; display: none');
      // bodyTd.innerHTML = email.body;
      
      let timestampTd = document.createElement('td');
      timestampTd.setAttribute('id', 'timestamp');
      timestampTd.setAttribute('style', 'text-overflow: ellipsis');
      timestampTd.innerHTML = email.timestamp;
      
      // Create a div and add all element inside
      let sentCover = document.createElement('div');
      sentCover.setAttribute('style', 'border: 1px solid lightblue');
      
      // Change div color according to read or unread
      // console.log(`email.read: ${email.read}`);
      // console.log(`email.read type: ${typeof(email.read)}`);
      if (Boolean(email.read) === true) {
        sentCover.style.backgroundColor = 'gray';
      }
      else if (Boolean(email.read) === false) {
        sentCover.style.backgroundColor = 'white';
      }
      if (mailbox === 'sent') {
        senderTd.style.display = 'none';
      }
      else {
        recipientShortenTd.style.display = 'none';
        toTd.style.display = 'none';
      }

      sentCover.id = email.id;
      // console.log(`id: ${sentCover.id}`);
      // sentCover.append(toTd, senderTd, recipientShortenTd, recipientTd, subjectTd, bodyTd, timestampTd);
      sentCover.append(toTd, senderTd, recipientShortenTd, subjectTd, timestampTd);
      
      // Hide archived mails if in inbox field
      if (mailbox === 'inbox' && Boolean(email.archived) === true) {
        sentCover.style.display = 'none';
      }

      // Hide un-archived mails if in archived field
      if (mailbox === 'archive' && Boolean(email.archived) === false) {
        sentCover.style.display = 'none';
      }
      
      // document.body.append(sentCover);
      document.querySelector('#emails-view').appendChild(sentCover);
      
    }
    // Make emails div become clickable
    divClick(mailbox);
  });
}


// When clicks on div 
function divClick(mailbox) {
  // Below is HTMLCollection, access by item()(shorthand is []) or namedItem()(shorthand is [''])
  let emailChildren = document.querySelector('#emails-view').getElementsByTagName('div');
  
  let emailChildrenArray = Array.from(emailChildren);
  
  emailChildrenArray.forEach(function(element) {
    // Make div clickable 
    element.style.cursor = 'pointer';
    
    // When click on a div 
    element.addEventListener('click', function() {
      // Hide all div 
      emailChildrenArray.forEach(function(element) {
        element.style.display = 'none';
      });

      // Make unread-mail to read-mail
      if (Boolean(element.read) === false) {
        fetch(`/emails/${element.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        });
        console.log(element);
      }

      // Get mail content 
      fetch(`/emails/${element.id}`)
      .then(response => response.json())
      .then(email => {
        // Print emails
        console.log(email);
        
        // ... do something else with emails ...
        let senderDiv = document.createElement('h6');
        senderDiv.innerHTML = email.sender;
        
        let subjectDiv = document.createElement('h5');
        subjectDiv.innerHTML = email.subject;
  
        let keyArray = Object.keys(email.recipients);
        let recipientArray = [];
        // Get keys of recipients object 
        for (let key of keyArray) {
          if (email.recipients[key] === document.querySelector('#compose-form').getElementsByTagName('input')[0].value) {
            recipientArray = ['me'];
            break;
          }
          recipientArray.push(email.recipients[key]);
        }
        let recipientDiv = document.createElement('h6');
        recipientDiv.style.paddingBottom = '0.5rem';
        recipientDiv.innerHTML = `<span>To</span> ${recipientArray}`;
        
        let bodyDiv = document.createElement('div');
        bodyDiv.style.paddingBottom = '20px';
        bodyDiv.innerHTML = email.body;
  
        let timestampDiv = document.createElement('div');
        timestampDiv.style.paddingBottom = '20px';
        timestampDiv.innerHTML = email.timestamp;

        // For archive 
        let buttonDiv = document.createElement('div');
        let archivedButton = document.createElement('button');
        // Archive email
        if (mailbox === 'inbox') {
          archivedButton.innerHTML = 'archive';
          archivedButton.addEventListener('click', function() {
            fetch(`/emails/${element.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: true
              })
            });
            console.log(email);
            window.location.reload();
          });
        }

        // Unarchive mail
        if (mailbox === 'archive') {
          archivedButton.innerHTML = 'unarchive';
          archivedButton.addEventListener('click', function() {
            fetch(`/emails/${element.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: false
              })
            });
            console.log(email);
            window.location.reload();
          });
        }

        if (mailbox === 'sent') {
          archivedButton.style.display = 'none';
        }

        // For reply 
        let replyButton = document.createElement('button');
        replyButton.innerHTML = 'Reply';
        replyButton.onclick = function() {
          compose_email();
          
          // Fill recipient field 
          if (mailbox === 'sent') {
            document.querySelector('#compose-recipients').value = recipientArray;
          }
          if (mailbox !== 'sent') {
            document.querySelector('#compose-recipients').value = email.sender;
          }

          // Add subject to compose 
          if (email.subject.slice(0,3) === 'Re:') {
            document.querySelector('#compose-subject').value = email.subject;
          }
          else {
            document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
          }

          document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
          document.querySelector('#compose-body').focus();
          document.querySelector('#compose-body').setSelectionRange(0,0);
        }

        buttonDiv.append(archivedButton, replyButton);

        document.querySelector('#emails-view').append(subjectDiv, senderDiv, recipientDiv, bodyDiv, timestampDiv, buttonDiv);
      });
    });
  });
}


