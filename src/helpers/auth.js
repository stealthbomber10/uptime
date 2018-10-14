import firebase from 'firebase';

export function register (email, password, name, number) {
  let nameArray = name.split(' ');
  let firstName = nameArray[0];
  let lastName = "";
  if (nameArray.length > 1)
    lastName = nameArray[1]

  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      user.updateProfile({
        displayName: firstName
      })
      saveUserDetails(user, firstName, lastName, number);
    });
}

export function logout () {
  return firebase.auth().signOut();
}

export function login (email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function resetPassword (email) {
  return firebase.auth().sendPasswordResetEmail(email);
}

export function saveUserDetails (user, firstName, lastName, number) {
  return firebase.database().ref().child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid,
      firstName: firstName,
      lastName: lastName,
      number: number,
    })
    .then(() => user);
}
